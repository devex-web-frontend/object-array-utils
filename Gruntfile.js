module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['src/**/*.js']
		},

		karma: {
			unit_dev: {
				configFile: 'karma.unit.conf.js',
				autoWatch: true,
				browsers: ['PhantomJS'],
				coverageReporter: {
					type: 'html',
					dir: 'coverage'
				}
			},
			unit: {
				configFile: 'karma.unit.conf.js',
				singleRun: true,
				browsers: ['PhantomJS'],
				coverageReporter: {
					type: 'text'
				}
			}
		},

		shell: {
			install: {
				command: 'node node_modules/bower/bin/bower install'
			}
		},

		clean: {
			install: {
				src: ['lib/']
			},
			coverage: {
				src: ['coverage/']
			}
		},

		jscs: {
			options: {
				config: '.jscsrc'
			},
			files: ['src/**/*.js']
		},

		jsdox: {
				generate: {
					src: "./src/*.js",
					dest: "./docs"
				}
			}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-interactive-shell');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jscs-checker');
	grunt.loadNpmTasks('grunt-jsdox');

	grunt.registerTask('install', ['clean:install', 'shell:install']);
	grunt.registerTask('check_style', ['jscs', 'jshint']);
	grunt.registerTask('test', ['install', 'check_style', 'karma:unit']);
	grunt.registerTask('test_dev', ['install', 'check_style', 'clean:coverage', 'karma:unit_dev']);
	grunt.registerTask('build', ['test']);
	grunt.registerTask('default', ['test_dev']);
};