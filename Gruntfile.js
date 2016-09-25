module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'index.js', 'test/**/*.spec.js']
    },
    watch: {
      files: ['Gruntfile.js', 'index.js', 'test/**/*.spec.js'],
      tasks: ['jshint']
    },
    mocha_istanbul: {
      test: {
        src: "test",
        options: {
          mask: "*.spec.js"
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage',
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['README.md', 'index.js'],
        options: {
          destination: 'docs',
          template : "node_modules/ink-docstrap/template",
          configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-jsdoc');
};
