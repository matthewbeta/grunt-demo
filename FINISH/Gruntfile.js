module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
		 	compass: {
	    	files: ['**/*.{scss,sass}'],
	    	tasks: ['compass:dev']
	    },
	    js: {
				files: ['js/**/*.js'],
				tasks: ['uglify']
			},
		},
   	compass: {
	    dev: {
        options: {              
          sassDir: ['styles/sass'],
          cssDir: ['styles/css'],
		  		environment: 'development'    
				}
	    },
      prod: {
        options: {              
          sassDir: ['styles/sass'],
          cssDir: ['styles/css'],
		  		environment: 'production'     
		  	}
      },
    },
    uglify: {
		all: {
			files: {
	        	'JS/min/main.min.js': [
	        	'JS/libs/jquery.js', 
	        	'JS/main.js'
	        	]
	    	}
		},
	},
  });

  // Load the plugin
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['compass:dev' , 'uglify' , 'watch']);
  // prod build
  grunt.registerTask('prod', ['compass:prod']);

};