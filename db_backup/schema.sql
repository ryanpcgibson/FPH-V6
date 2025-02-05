

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgaudit" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."continents" AS ENUM (
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Oceania',
    'North America',
    'South America'
);


ALTER TYPE "public"."continents" OWNER TO "postgres";


CREATE TYPE "public"."member_types" AS ENUM (
    'owner',
    'editor',
    'viewer'
);


ALTER TYPE "public"."member_types" OWNER TO "postgres";


CREATE TYPE "public"."profile_types" AS ENUM (
    'editor',
    'contributorviewer'
);


ALTER TYPE "public"."profile_types" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."OLD_get_family_records"("family_id_param" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    result jsonb;
BEGIN
    WITH pets_data AS (
        SELECT p.id AS pet_id,
               p.name AS pet_name,
               p.type AS pet_type,
               p.breed AS pet_breed,
               p.color AS pet_color,
               p.created_at AS pet_created_at,
               (
                   SELECT json_agg(to_jsonb(m.*))
                   FROM pet_moments pm
                   JOIN moments m ON m.id = pm.moment_id
                   WHERE pm.pet_id = p.id
               ) AS moments
        FROM pets p
        WHERE p.family_id = family_id_param
    ),
    locations_data AS (
        SELECT l.id AS location_id,
               l.name AS location_name,
               l.created_at AS location_created_at,
               (
                   SELECT json_agg(to_jsonb(m.*))
                   FROM location_moments lm
                   JOIN moments m ON m.id = lm.moment_id
                   WHERE lm.location_id = l.id
               ) AS moments
        FROM locations l
        WHERE l.family_id = family_id_param
    ),
    moments_data AS (
        SELECT 
            m.id AS moment_id,
            m.title,
            m.created_at,
            (
                SELECT json_agg(to_jsonb(ph.*) ORDER BY ph.created_at DESC)
                FROM photos ph
                WHERE ph.moment_id = m.id
            ) AS photos,
            (
                SELECT json_agg(to_jsonb(l.*) ORDER BY l.name)
                FROM location_moments lm
                JOIN locations l ON l.id = lm.location_id
                WHERE lm.moment_id = m.id
            ) AS locations,
            (
                SELECT json_agg(to_jsonb(p.*) ORDER BY p.name)
                FROM pet_moments pm
                JOIN pets p ON p.id = pm.pet_id
                WHERE pm.moment_id = m.id
            ) AS pets
        FROM moments m
        WHERE m.family_id = family_id_param
    )
    SELECT jsonb_build_object(
        'family', (SELECT to_jsonb(f.*) FROM families f WHERE id = family_id_param),
        'pets_data', (SELECT json_agg(pets_data) FROM pets_data),
        'locations_data', (SELECT json_agg(locations_data) FROM locations_data),
        'moments_data', (SELECT json_agg(moments_data) FROM moments_data)
    ) INTO result;

    RETURN result;
END;$$;


ALTER FUNCTION "public"."OLD_get_family_records"("family_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."dbg_update_name_by_email"("p_email" character varying, "p_display_name" character varying) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    v_user_id UUID;
BEGIN
    -- Find the user ID by email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email
    LIMIT 1;

    -- If the user exists, update the raw_user_meta_data in auth.users
    IF v_user_id IS NOT NULL THEN
        -- Update the auth.users table
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_build_object(
            'sub', v_user_id,
            'email', p_email,
            'display_name', p_display_name,
            'email_verified', false,
            'phone_verified', false
        )
        WHERE id = v_user_id;

        -- Update the display_name in public.users table
        UPDATE public.users
        SET display_name = p_display_name
        WHERE id = v_user_id;

    ELSE
        RAISE NOTICE 'User with email % not found.', p_email;
    END IF;
END;$$;


ALTER FUNCTION "public"."dbg_update_name_by_email"("p_email" character varying, "p_display_name" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_editable_user_family_ids"("p_user_id" "uuid") RETURNS TABLE("family_id" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fu.family_id
    FROM 
        public.family_users fu
    WHERE 
        fu.user_id = p_user_id
        and fu.member_type IN ('owner', 'editor');
END;
$$;


ALTER FUNCTION "public"."get_editable_user_family_ids"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_families"() RETURNS TABLE("id" integer, "name" "text", "member_type" "public"."member_types")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id,
        f.name,
        fu.member_type
    FROM
        public.families f
        JOIN public.family_users fu ON f.id = fu.family_id
    WHERE
        fu.user_id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."get_families"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_family_ids_for_user"("p_user_id" "uuid") RETURNS TABLE("family_id" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    RETURN QUERY
    SELECT 
        fu.family_id
    FROM 
        public.family_users fu
    WHERE 
        fu.user_id = p_user_id;
END;$$;


ALTER FUNCTION "public"."get_family_ids_for_user"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_family_records"("param_family_id" integer) RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result json;
BEGIN
    WITH 
    -- Pets belonging to the family
    pets_data AS (
        SELECT json_agg(p ORDER BY p.name) AS pets
        FROM pets p
        WHERE family_id = param_family_id
    ),
    
    -- Family locations
    locations_data AS (
        SELECT json_agg(l ORDER BY l.created_at DESC) AS locations
        FROM locations l
        WHERE family_id = param_family_id
    ),
    
    -- Family users with efficient JOIN
    users_data AS (
        SELECT json_agg(u ORDER BY u.created_at) AS users
        FROM users u
        INNER JOIN family_users fu ON u.id = fu.user_id
        WHERE fu.family_id = param_family_id
    ),
    
    -- Updated moments_data CTE with new photo selection
    moments_data AS (
        SELECT json_agg(moment_info ORDER BY moment_info.title) AS moments
        FROM (
            SELECT 
                m.*,
                (
                    SELECT json_agg(to_jsonb(o.*) ORDER BY o.created_at DESC)
                    FROM public.moment_photos p 
                    JOIN storage.objects o ON o.id = p.photo_id 
                    WHERE o.bucket_id = 'photos' AND p.moment_id = m.id
                ) AS photos,
                (
                    SELECT json_agg(to_jsonb(l.*) ORDER BY l.name)
                    FROM location_moments lm
                    JOIN locations l ON l.id = lm.location_id
                    WHERE lm.moment_id = m.id AND l.family_id = param_family_id
                ) AS locations,
                (
                    SELECT json_agg(to_jsonb(p.*) ORDER BY p.name)
                    FROM pet_moments pm
                    JOIN pets p ON p.id = pm.pet_id
                    WHERE pm.moment_id = m.id AND p.family_id = param_family_id
                ) AS pets
            FROM moments m
            WHERE m.family_id = param_family_id
        ) AS moment_info
    )
    
    -- Final result assembly
    SELECT json_build_object(
        'pets', COALESCE((SELECT pets FROM pets_data), '[]'::json),
        'locations', COALESCE((SELECT locations FROM locations_data), '[]'::json),
        'users', COALESCE((SELECT users FROM users_data), '[]'::json),
        'moments', COALESCE((SELECT moments FROM moments_data), '[]'::json)
    ) INTO result;

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_family_records"("param_family_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_user_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  raise notice 'User ID: %', auth.uid();
  return new;
end;
$$;


ALTER FUNCTION "public"."log_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_added_by_to_auth_user_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    NEW.added_by := auth.uid();
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."set_added_by_to_auth_user_id"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."TBDEL-photos" (
    "old_id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "moment_id" integer,
    "path" "text" NOT NULL,
    "id" "uuid"
);


ALTER TABLE "public"."TBDEL-photos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."families" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"(),
    "name" "text" NOT NULL
);


ALTER TABLE "public"."families" OWNER TO "postgres";


ALTER TABLE "public"."families" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."families_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."family_users" (
    "family_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "member_type" "public"."member_types" NOT NULL
);


ALTER TABLE "public"."family_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."location_moments" (
    "moment_id" integer NOT NULL,
    "location_id" integer NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"() NOT NULL
);


ALTER TABLE "public"."location_moments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "map_reference" character varying,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "name" "text" NOT NULL,
    "family_id" integer
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


ALTER TABLE "public"."locations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."locations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."moment_photos" (
    "moment_id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "photo_id" "uuid" NOT NULL
);


ALTER TABLE "public"."moment_photos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."moments" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "title" "text" NOT NULL,
    "body" character varying,
    "family_id" integer
);


ALTER TABLE "public"."moments" OWNER TO "postgres";


ALTER TABLE "public"."moments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."moments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pet_moments" (
    "pet_id" integer NOT NULL,
    "moment_id" integer NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"() NOT NULL
);


ALTER TABLE "public"."pet_moments" OWNER TO "postgres";


ALTER TABLE "public"."pet_moments" ALTER COLUMN "pet_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pet_moments_pet_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pets" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "family_id" integer NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."pets" OWNER TO "postgres";


ALTER TABLE "public"."pets" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."TBDEL-photos" ALTER COLUMN "old_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."photos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "display_name" "text",
    "created_at" time with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."id" IS 'References the internal Supabase Auth user.';



CREATE OR REPLACE VIEW "public"."users_ext" WITH ("security_invoker"='true') AS
 SELECT "u"."id",
    "u"."email",
    "u"."display_name",
    "fu"."family_id",
    "fu"."member_type"
   FROM ("public"."users" "u"
     JOIN "public"."family_users" "fu" ON (("u"."id" = "fu"."user_id")));


ALTER TABLE "public"."users_ext" OWNER TO "postgres";


ALTER TABLE ONLY "public"."families"
    ADD CONSTRAINT "families_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."family_users"
    ADD CONSTRAINT "family_users_pkey" PRIMARY KEY ("family_id", "user_id");



ALTER TABLE ONLY "public"."location_moments"
    ADD CONSTRAINT "location_moments_pkey" PRIMARY KEY ("moment_id", "location_id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moment_photos"
    ADD CONSTRAINT "moment_photos_pkey" PRIMARY KEY ("moment_id", "photo_id");



ALTER TABLE ONLY "public"."moments"
    ADD CONSTRAINT "moments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pet_moments"
    ADD CONSTRAINT "pet_moments_pkey" PRIMARY KEY ("pet_id", "moment_id");



ALTER TABLE ONLY "public"."pets"
    ADD CONSTRAINT "pets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."TBDEL-photos"
    ADD CONSTRAINT "photos_pkey" PRIMARY KEY ("old_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_family_users_family_id" ON "public"."family_users" USING "btree" ("family_id");



CREATE INDEX "idx_location_moments_location_id" ON "public"."location_moments" USING "btree" ("location_id");



CREATE INDEX "idx_location_moments_moment_id" ON "public"."location_moments" USING "btree" ("moment_id");



CREATE INDEX "idx_locations_family_id" ON "public"."locations" USING "btree" ("family_id");



CREATE INDEX "idx_moments_title" ON "public"."moments" USING "btree" ("title");



CREATE INDEX "idx_pet_moments_moment_id" ON "public"."pet_moments" USING "btree" ("moment_id");



CREATE INDEX "idx_pets_family_id" ON "public"."pets" USING "btree" ("family_id");



CREATE INDEX "idx_photos_moment_id" ON "public"."TBDEL-photos" USING "btree" ("moment_id");



ALTER TABLE ONLY "public"."families"
    ADD CONSTRAINT "families_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."family_users"
    ADD CONSTRAINT "family_users_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id");



ALTER TABLE ONLY "public"."family_users"
    ADD CONSTRAINT "family_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."family_users"
    ADD CONSTRAINT "family_users_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."location_moments"
    ADD CONSTRAINT "location_moments_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."location_moments"
    ADD CONSTRAINT "location_moments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."location_moments"
    ADD CONSTRAINT "location_moments_moment_id_fkey" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moment_photos"
    ADD CONSTRAINT "moment_photos_moment_id_fkey" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moment_photos"
    ADD CONSTRAINT "moment_photos_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "storage"."objects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moments"
    ADD CONSTRAINT "moments_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."moments"
    ADD CONSTRAINT "moments_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pet_moments"
    ADD CONSTRAINT "pet_moments_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."pet_moments"
    ADD CONSTRAINT "pet_moments_moment_id_fkey" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pet_moments"
    ADD CONSTRAINT "pet_moments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pets"
    ADD CONSTRAINT "pets_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."pets"
    ADD CONSTRAINT "pets_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."TBDEL-photos"
    ADD CONSTRAINT "photos_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."TBDEL-photos"
    ADD CONSTRAINT "photos_id_fkey" FOREIGN KEY ("id") REFERENCES "storage"."objects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."TBDEL-photos"
    ADD CONSTRAINT "photos_moment_id_fkey" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable ALL based on added_by" ON "public"."TBDEL-photos" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by"));



CREATE POLICY "Enable ALL based on added_by" ON "public"."families" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by")) WITH CHECK (true);



CREATE POLICY "Enable ALL based on added_by" ON "public"."location_moments" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by")) WITH CHECK (true);



CREATE POLICY "Enable ALL based on added_by" ON "public"."locations" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by"));



CREATE POLICY "Enable ALL based on added_by" ON "public"."moments" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by"));



CREATE POLICY "Enable ALL based on added_by" ON "public"."pet_moments" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by")) WITH CHECK (true);



CREATE POLICY "Enable ALL based on added_by" ON "public"."pets" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "added_by"));



ALTER TABLE "public"."TBDEL-photos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."families" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."family_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."location_moments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "modifiable_by_editors" ON "public"."families" TO "authenticated" USING (("id" IN ( SELECT "get_editable_user_family_ids"."family_id"
   FROM "public"."get_editable_user_family_ids"("auth"."uid"()) "get_editable_user_family_ids"("family_id"))));



CREATE POLICY "modifiable_by_editors" ON "public"."family_users" TO "authenticated" USING (("family_id" IN ( SELECT "get_editable_user_family_ids"."family_id"
   FROM "public"."get_editable_user_family_ids"("auth"."uid"()) "get_editable_user_family_ids"("family_id"))));



CREATE POLICY "modifiable_by_editors" ON "public"."locations" TO "authenticated" USING (("family_id" IN ( SELECT "get_editable_user_family_ids"."family_id"
   FROM "public"."get_editable_user_family_ids"("auth"."uid"()) "get_editable_user_family_ids"("family_id"))));



CREATE POLICY "modifiable_by_editors" ON "public"."moments" TO "authenticated" USING (("family_id" IN ( SELECT "get_editable_user_family_ids"."family_id"
   FROM "public"."get_editable_user_family_ids"("auth"."uid"()) "get_editable_user_family_ids"("family_id"))));



CREATE POLICY "modifiable_by_editors" ON "public"."pets" TO "authenticated" USING (("family_id" IN ( SELECT "get_editable_user_family_ids"."family_id"
   FROM "public"."get_editable_user_family_ids"("auth"."uid"()) "get_editable_user_family_ids"("family_id"))));



CREATE POLICY "modifiable_by_editors" ON "public"."users" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."family_users" "fu"
  WHERE (("fu"."user_id" = "users"."id") AND ("fu"."family_id" IN ( SELECT "family_users"."family_id"
           FROM "public"."family_users"
          WHERE ("family_users"."user_id" = "auth"."uid"())))))));



ALTER TABLE "public"."moment_photos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."moments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pet_moments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "viewable_by_family" ON "public"."TBDEL-photos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."moments" "m"
     JOIN "public"."pet_moments" "pm" ON (("m"."id" = "pm"."moment_id")))
     JOIN "public"."pets" "p" ON (("pm"."pet_id" = "p"."id")))
  WHERE (("TBDEL-photos"."moment_id" = "m"."id") AND ("p"."family_id" IN ( SELECT "public"."get_family_ids_for_user"("auth"."uid"()) AS "get_family_ids_for_user"))))));



CREATE POLICY "viewable_by_family" ON "public"."families" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "public"."get_family_ids_for_user"("auth"."uid"()) AS "get_family_ids_for_user")));



CREATE POLICY "viewable_by_family" ON "public"."family_users" TO "authenticated" USING (("family_id" IN ( SELECT "get_family_ids_for_user"."family_id"
   FROM "public"."get_family_ids_for_user"("auth"."uid"()) "get_family_ids_for_user"("family_id"))));



CREATE POLICY "viewable_by_family" ON "public"."location_moments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."locations" "l"
  WHERE (("location_moments"."location_id" = "l"."id") AND ("l"."family_id" IN ( SELECT "get_family_ids_for_user"."family_id"
           FROM "public"."get_family_ids_for_user"("auth"."uid"()) "get_family_ids_for_user"("family_id")))))));



CREATE POLICY "viewable_by_family" ON "public"."locations" FOR SELECT TO "authenticated" USING (("family_id" IN ( SELECT "public"."get_family_ids_for_user"("auth"."uid"()) AS "get_family_ids_for_user")));



CREATE POLICY "viewable_by_family" ON "public"."moments" FOR SELECT TO "authenticated" USING (("family_id" IN ( SELECT "public"."get_family_ids_for_user"("auth"."uid"()) AS "get_family_ids_for_user")));



CREATE POLICY "viewable_by_family" ON "public"."pet_moments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."moments" "m"
  WHERE (("pet_moments"."moment_id" = "m"."id") AND ("m"."family_id" IN ( SELECT "get_family_ids_for_user"."family_id"
           FROM "public"."get_family_ids_for_user"("auth"."uid"()) "get_family_ids_for_user"("family_id")))))));



CREATE POLICY "viewable_by_family" ON "public"."pets" FOR SELECT TO "authenticated" USING (("family_id" IN ( SELECT "public"."get_family_ids_for_user"("auth"."uid"()) AS "get_family_ids_for_user")));



CREATE POLICY "viewable_by_family" ON "public"."users" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."family_users" "fu"
  WHERE (("fu"."user_id" = "users"."id") AND ("fu"."family_id" IN ( SELECT "family_users"."family_id"
           FROM "public"."family_users"
          WHERE ("family_users"."user_id" = "auth"."uid"())))))));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."OLD_get_family_records"("family_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."OLD_get_family_records"("family_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."OLD_get_family_records"("family_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."dbg_update_name_by_email"("p_email" character varying, "p_display_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dbg_update_name_by_email"("p_email" character varying, "p_display_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dbg_update_name_by_email"("p_email" character varying, "p_display_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_editable_user_family_ids"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_editable_user_family_ids"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_editable_user_family_ids"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_families"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_families"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_families"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_family_ids_for_user"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_family_ids_for_user"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_family_ids_for_user"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_family_records"("param_family_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_family_records"("param_family_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_family_records"("param_family_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_added_by_to_auth_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_added_by_to_auth_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_added_by_to_auth_user_id"() TO "service_role";


















GRANT ALL ON TABLE "public"."TBDEL-photos" TO "anon";
GRANT ALL ON TABLE "public"."TBDEL-photos" TO "authenticated";
GRANT ALL ON TABLE "public"."TBDEL-photos" TO "service_role";



GRANT ALL ON TABLE "public"."families" TO "anon";
GRANT ALL ON TABLE "public"."families" TO "authenticated";
GRANT ALL ON TABLE "public"."families" TO "service_role";



GRANT ALL ON SEQUENCE "public"."families_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."families_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."families_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."family_users" TO "anon";
GRANT ALL ON TABLE "public"."family_users" TO "authenticated";
GRANT ALL ON TABLE "public"."family_users" TO "service_role";



GRANT ALL ON TABLE "public"."location_moments" TO "anon";
GRANT ALL ON TABLE "public"."location_moments" TO "authenticated";
GRANT ALL ON TABLE "public"."location_moments" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."locations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."locations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."locations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."moment_photos" TO "anon";
GRANT ALL ON TABLE "public"."moment_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."moment_photos" TO "service_role";



GRANT ALL ON TABLE "public"."moments" TO "anon";
GRANT ALL ON TABLE "public"."moments" TO "authenticated";
GRANT ALL ON TABLE "public"."moments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."moments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."moments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."moments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pet_moments" TO "anon";
GRANT ALL ON TABLE "public"."pet_moments" TO "authenticated";
GRANT ALL ON TABLE "public"."pet_moments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pet_moments_pet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pet_moments_pet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pet_moments_pet_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pets" TO "anon";
GRANT ALL ON TABLE "public"."pets" TO "authenticated";
GRANT ALL ON TABLE "public"."pets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pets_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."photos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."photos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."photos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."users_ext" TO "anon";
GRANT ALL ON TABLE "public"."users_ext" TO "authenticated";
GRANT ALL ON TABLE "public"."users_ext" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
