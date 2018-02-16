let bundles = {
    "fr": {
        locale: "fr-FR",
        strings: {
            "Minify your links": "Minifiez vos liens",
            "Your original URL here": "Votre lien original ici",
            "Shorten URL": "Raccourcir",
            "All kuuu.ga URLs are deleted after one year of inactivity": "Tous les liens sont supprimés après un an d'inactivité",

            "Minified !": "Minifié !",
            "Your link was minified !": "Votre lien a été raccourci !",
            "Copy": "Copier",
            "Copied !": "Copié !"
        }
    },
    "es": {
        locale: "es-ES",
        strings: {
            "Minify your links": "Corta su enlaces",
            "Your original URL here": "Su original URL aquí",
            "Shorten URL": "Cortar el URL",
            "All kuuu.ga URLs are deleted after one year of inactivity": "Todos los URLs se borrarán después de un año de inactividad",

            "Minified !": "Reducido !",
            "Your link was minified !": "Su enlace se redujo !",
            "Copy": "Copia",
            "Copied !": "Copiado !"
        }
    },
    "en": {
        locale: "en-US",
        strings: {
            "Minify your links": "Minify your links",
            "Your original URL here": "Your original URL here",
            "Shorten URL": "Shorten URL",
            "All kuuu.ga URLs are deleted after one year of inactivity": "All kuuu.ga URLs are deleted after one year of inactivity",

            "Minified !": "Minified !",
            "Your link was minified !": "Your link was minified !",
            "Copy": "Copy",
            "Copied !": "Copied !"
        }
    }
};

let langCheck = (langId) => {
    if (langId === "fr" || langId === "es") {
        return langId
    } else {
        return "en"
    }
};

module.exports = {bundles: bundles, langCheck: langCheck};