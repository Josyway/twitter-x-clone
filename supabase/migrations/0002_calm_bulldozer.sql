ALTER TABLE profiles
ADD CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.validate_username_before_charge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Validação do nome de usuário em INSERT e UPDATE
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.raw_user_meta_data->>'username' IS NULL OR TRIM(NEW.raw_user_meta_data->>'username') = '' THEN
            RAISE EXCEPTION 'O nome de usuário deve ser fornecido para esta operação!';
        END IF;

        -- Validação de unicidade do nome de usuário
        IF EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE username = NEW.raw_user_meta_data->>'username'
                AND id != NEW.id
        ) THEN
            RAISE EXCEPTION 'Nome de usuário "%" já existe!', NEW.raw_user_meta_data->>'username';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER check_username_before_update_auth_users -- Correção no nome do trigger
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.raw_user_meta_data->>'username' IS DISTINCT FROM NEW.raw_user_meta_data->>'username')
    EXECUTE FUNCTION public.validate_username_before_charge();

CREATE TRIGGER check_username_before_insert_auth_users
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_username_before_charge();

CREATE OR REPLACE FUNCTION public.update_profile_username()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    UPDATE public.profiles
    SET username = NEW.raw_user_meta_data->>'username'
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.raw_user_meta_data->>'username' IS DISTINCT FROM NEW.raw_user_meta_data->>'username')
    EXECUTE FUNCTION public.update_profile_username();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users  -- Alterado para AFTER INSERT
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();