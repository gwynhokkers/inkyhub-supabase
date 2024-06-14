import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
	theme: {
		extend: {
			fontFamily: {
				sans: ['DM Sans', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				'te-papa-green': {
					50: '#f0fdf9',
					100: '#cdfaed',
					200: '#9bf4dd',
					300: '#61e7c9',
					400: '#31d0b2',
					500: '#18b499',
					600: '#10917d',
					700: '#117466',
					800: '#135c52',
					900: '#144d45',
					950: '#07403b'
				}
			}
		}
	}
}
