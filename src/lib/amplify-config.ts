"use client";

import { Amplify } from "aws-amplify";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
            loginWith: {
                username: true
            },
        }
    }
})

I18n.putVocabularies(translations);
I18n.setLanguage("es");

I18n.putVocabularies({
    es: {
        Username: "Usuario",
        'Enter your Username': "Ingrese su nombre de usuario",
        'Enter your Password': "Ingrese su contraseña"
    }
})