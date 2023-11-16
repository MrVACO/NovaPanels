const mix = require('laravel-mix')
const webpack = require('webpack')
const path = require('path')

class NovaExtension {
    name() {
        return 'nova-extension'
    }
    
    register(name) {
        this.name = name
    }
    
    webpackConfig(webpackConfig) {
        webpackConfig.externals = {
            vue: 'Vue',
        }
        
        webpackConfig.resolve.alias = {
            ...(webpackConfig.resolve.alias || {}),
            'laravel-nova': path.join(
                __dirname,
                '../../vendor/laravel/nova/resources/js/mixins/packages.js'
            ),
            'laravel-util': path.join(
                __dirname,
                '../../vendor/laravel/nova/resources/js/util/index.js'
            ),
            'laravel-mixins': path.join(
                __dirname,
                '../../vendor/laravel/nova/resources/js/mixins/index.js'
            ),
            'laravel-mixins-short': path.join(
                __dirname,
                './resources/js/short_mixins'
            ),
        }
        
        webpackConfig.output = {
            uniqueName: this.name,
        }
    }
}

mix.extend('nova', new NovaExtension())
