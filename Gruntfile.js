var testHarness = require('./test_harness'),
    promisesAplusTests = require('promises-aplus-tests');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-wrap');

    grunt.initConfig({
        ts: {
            tsd: {
                src: [
                    'tsd.ts'
                ]
            },
            options: {
                target: 'es5',
                module: 'commonjs',
                declaration: true,
                sourceMap: false,
                removeComments: true,
                noImplicitAny: true
            },
        },

        browserify: {
            tsd: {
                src: ['tsd.js'],
                dest: 'build/tsd.js',
                options: {
                    browserifyOptions: {
                        standalone: 'TypescriptDeferred'
                    }
                }
            }
        },

        uglify: {
            tsd: {
                src: 'build/tsd.js',
                dest: 'build/tsd.min.js'
            }
        },

        wrap: {
            tsd: {
                src: 'tsd.d.ts',
                dest: 'tsd.d.ts',
                options: {
                    wrapper: ['module "tsd" {\n', '\n}\n'],
                    indent: '    '
                }
            }
        },

        clean: {
            tsd: ['.tscache', 'tsd.js', 'tsd.d.ts', 'build']
        }
    });

    grunt.registerTask('test', 'Run the Promises/A+ test suite', function() {
        var done = this.async();

        promisesAplusTests(testHarness, function(err) {
            done(!err);
        });
    });

    grunt.registerTask('default', ['clean', 'ts', 'wrap', 'browserify', 'uglify']);
};
