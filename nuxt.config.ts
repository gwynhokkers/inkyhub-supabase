// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
	modules: [
		'@nuxt/eslint',
		'@nuxt/ui',
		'@nuxt/fonts',
		'@vueuse/nuxt',
		'@nuxtjs/supabase',
		'@pinia/nuxt',
		'@vite-pwa/nuxt',
		'nuxt-vuefire'
	],
	ui: {
		icons: ['heroicons', 'simple-icons'],
		safelistColors: ['primary', 'red', 'orange', 'green']
	},
	devtools: {
		enabled: true
	},
	typescript: {
		strict: false
	},
	supabase: {
		// redirect: false
		redirectOptions: {
			login: '/login',
			callback: '/confirm',
			include: undefined,
			exclude: ['/signup', '/reset-password', '/confirm'],
			cookieRedirect: false
		}
	},
	pinia: {
		storesDirs: ['./stores/**', './custom-folder/stores/**']
	},
	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: false,
				commaDangle: 'never',
				braceStyle: '1tbs'
			}
		}
	},

	vuefire: {
		config: {
			apiKey: 'AIzaSyBiZRWQ0wF32pBekAy1he3cZ_KWp2v2XJM',
			authDomain: 'inky-hub.firebaseapp.com',
			projectId: 'inky-hub',
			storageBucket: 'inky-hub.appspot.com',
			messagingSenderId: '988346246167',
			appId: '1:988346246167:web:53cc52ab80d8fd276c6852',
			measurementId: 'G-G22NS14SR9'
		}
	},

	pwa: {
		scope: '/',
		strategies: 'injectManifest',
		srcDir: 'service-worker',
		filename: 'sw.ts',
		registerType: 'autoUpdate',
		manifest: {
			name: 'Inky Hub - A Hub for cephalopods',
			short_name: 'Inky Hub',
			theme_color: '#155a53',
			background_color: '#155a53',
			icons: [
				{
					src: 'pwa-192x192.png',
					sizes: '192x192',
					type: 'image/png'
				},
				{
					src: 'pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png'
				},
				{
					src: 'pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any'
				},
				{
					src: 'pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable'
				}
			]
		},
		injectManifest: {
			globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
			globIgnores: ['emojis/**', 'manifest**.webmanifest']
		},
		devOptions: {
			enabled: true,
			type: 'module'
		}
	},
	imports: {
		dirs: ['stores']
	}
})
