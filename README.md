grunt-demo
==========

<p class="drop-cap">Previously, we installed Node, NPM and Grunt including setting up a package.json and a Gruntfile. In this exciting installment, we're gonna plug everything in so you can see how amazers Grunt is, experience its awesome power and bathe in a warm glow of lazy satisfaction.</p>

If you haven't [installed Node, NPM and Grunt](http://matthew-jackson.com/notes/development/setting-up-grunt-from-scratch/), you need to. So jump over to that post and install all the stuff (its really not hard or too scary) and then come back.

Here's what we want Grunt to do for us:

1. Watch our project for changes to HTML, JS and Sass
2. Compile our Sass and Compass
3. Minify and concatenate our JS

Lets crack on.

## What is Grunt again?

Grunt is a javascript task runner, in that it is written in Javascript (using Node JS) and it runs tasks. Grunt uses 2 files - a package.json (which tells grunt what all the dependencies it needs are) and a Gruntfile. If you followed the previous article, you might have both of these in your project folder. If not go download or fork the [Github repo]().

## Package JSON File

The package.json file is an NPM thing. My understandign (or lack of) is that it stores metadata for all your Node dependencies in your project. Here's a [nice overview of package.json](http://docs.nodejitsu.com/articles/getting-started/npm/what-is-the-file-package-json).

## Installing a Grunt plugin

Grunt makes use of plugins to do all its automating and task running. We need several plugins to achieve our 5 goals set at the top of the post. We need one to watch for changes, one to run compass, one to concat/minify our JS and one to do the live reload multi device thingy. 

Jump over to your command line. First we need to browse to our project in the command line: 

{% highlight bash linenos %}
$ cd path/to/my/project/folder
{% endhighlight %}

So, if you input "cd" followed by the path to your project, you can now install the first plugin; grunt-contrib-watch

{% highlight bash linenos %}
$ npm install grunt-contrib-watch --save-dev
{% endhighlight %}

The command line will throw some robot-barf at you now but keep your cool. When thats done, go check your package.json file. It should have updated the dependenciy section to include grunt-contrib-watch:

{% highlight js linenos %}
{
 // ...
  "devDependencies": {
    "grunt": "~0.4.1",
    "grunt-contrib-watch": "~0.5.0"
  }
}
{% endhighlight %}

Now go back to the command line and repeat this process (ie. one by one) with the following plugins:

{% highlight bash linenos %}
$ npm install grunt-contrib-compass --save-dev
$ npm install grunt-contrib-uglify --save-dev
$ npm install grunt-style-injector --save-dev
{% endhighlight %}

So with a bit of luck, you now have all the plugins you need for your project. Your package.json should list all these in devDependencies (maybe a few more too).

## Gruntfile

A grunt file looks a bit like this:

{% highlight js linenos %}
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
   // CONFIG ===================================/

  });

  // DEPENDENT PLUGINS =========================/

  grunt.loadNpmTasks();

  // TASKS =====================================/

  grunt.registerTask('default', []);

};
{% endhighlight %}

The Gruntfile is split into 3 main sections:

1. Dependencies
2. Tasks
3. Task configuration

You set up the configuration and options in the first section of your Gruntfile, you then reference the plugin in the second section, then tell Grunt to run the plugin, as per the configuration. This is done by either typing "grunt" into the command line, or "grunt task-name" to run a specific or subset task.

Lets first list our dependencies to include. Find the line <code>grunt.loadNpmTasks();</code> and copy and paste it 3 times. It should now be this:

{% highlight js linenos %}

	// ...

	// DEPENDENT PLUGINS =========================/

	grunt.loadNpmTasks();
	grunt.loadNpmTasks();
	grunt.loadNpmTasks();

	// ...

};
{% endhighlight %}

 Add the name of a plugin, wrapped in quotes, between each set of brackets so it looks like this:

 {% highlight js linenos %}

	// ...

	// DEPENDENT PLUGINS =========================/

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// ...

};
{% endhighlight %}

Next, lets configure our watch task. Underneath the comment about Configuration copy and paste this:

{% highlight js linenos %}

// CONFIGURATION =============================/

watch: {
 	compass: {
    	files: ['**/*.{scss,sass}'],
    	tasks: ['compass:dev']
    },
    js: {
		files: ['**/*.js'],
		tasks: ['uglify']
	}
},
// ...

};
{% endhighlight %}

What we've done here is to create a watch task, sub tasks of that called compass (which we'll refer to now as watch:compass) and js (watch:js). We configured watch:compass task to watch files with .scss or .sass extensions. If they change the watch:compass task will call our "compass:dev" task. We configured the js task to watch for changes in js files and run the "uglify" task

Lets set up the Compass task. After the last closing bracket and comma of the watch task (follow the indentation) add the following:

{% highlight js linenos %}
compass: {
	dev: {
		options: {              
			sassDir: ['styles/sass'],
			cssDir: ['styles/css'],
			environment: 'development'
		}
	},
},
{% endhighlight %}

Now we've set up a compass task, with a sub task called dev (compass:dev), we've topld it where our sass is and where to output the css. We've also set the environment to production. This will use some defaults for our compilation which are useful for development (like keeping it expanded, adding line comments etc).

Now we could have just set up a compass task (without the dev bit). The options chunk would have just been between the compass:{} brackets. However, we're going to be a bit smarter thn that. We're going to set up a seperate sub task for production. Edit your compass task to look like this:

{% highlight js linenos %}
compass: {
	dev: {
		//... dev options here
	},
	prod: {
		options: {              
			sassDir: ['styles/sass'],
			cssDir: ['styles/css'],
			environment: 'production'
		}
 	},
},
{% endhighlight %}

Now we could call compass:prod as a task and it would copile our sass into a compressed style, ready for deployment.

Lets set up our ugilfy task to concat and minify our JS. After the compass task, add the following: 

{% highlight js linenos %}
uglify: {
	all: {
		files: {
        	'js/min/main.min.js': [
        	'js/libs/jquery.js', 
        	'js/main.js'
        	]
    	}
	},
},
{% endhighlight %}

When we call this task, Uglify is going to get all the files listed between the square brackets, minify them and then squish them all together. If we had some sort of HTML build process (say using a static site generator) we could include the full scripts in development and run the above minification code as apart of our prod task - just like we did with the Compass task above. 

Its this kind of build procedure that really makes Grunt shine over things like Codekit (which is awesome and that isn't meant to sound like a diss). You can run a tailored dev and production build just by using a <code>grunt prod</code> command. You could even use something like [Grunt Git Deploy](https://github.com/zonak/grunt-ftp-deploy) or [Grunt FTP Deploy](https://github.com/zonak/grunt-ftp-deploy) as part of the pro build and send your site up to the server. But I digress...

## Default task

We need to compile our CSS and JS when we kick Grunt off. We also wanna run our watch task. To do this, we'll trigger it using our default task. Find the line in your Gruntfile that looks like this: 

{% highlight js linenos %}
  grunt.registerTask('default', []);
{% endhighlight %}

Any tasks we want to run when we enter Grunt need to go between the square brackets. so add <code>'compass:dev' , 'uglify' , 'watch'</code> between the brackets (with quotes and comma seperated).

Anyways, lets try out what we've done so far. Jump over to your command line (making sure you're in your project folder), type "grunt" and <del>hit enter.</del> <ins>We forgot something!</ins>

If you had have pressed enter, you would have seen this:

{% highlight js linenos %}
Running "watch" task
Waiting...Warning: EMFILE, too many open files
{% endhighlight %}

over and over and over again... You can try doing it if you like, just be prepared to hit <code>ctrl + c</code> (Mac and Windows) to cancel the process.

The reason is we're watching all the JS files in our project. If you go take a peak in the node_modules folder (which was added when we installed all our node plugins, you'll see we have lots of folders wiht lots of javascript files in them. We need to be more specific about what js files to watch. Update your watch task:

{% highlight js linenos %}
watch: {
 	compass: {
    	files: ['**/*.{scss,sass}'],
    	tasks: ['compass:dev']
    },
    js: {
		files: ['js/**/*.js'], // <== CHANGE HERE
		tasks: ['uglify']
	}
},
{% endhighlight %}

By adding the js folder, we can ensure Grunt isn't wasting time and energy watching millions of js files (unless you have millions of js files in your js folder - I don't recommend a million javascript files in your project)

Try running grunt now by going to your command line and entering “grunt”.

{% highlight bash linenos %}

Running "compass:dev" (compass) task
unchanged styles/sass/style.scss
Compilation took 0.001s

Running "uglify:all" (uglify) task
File "JS/min/main.min.js" created.

Running "watch" task
Waiting...

{% endhighlight %}

Boom! The feedback is pretty self explanatory. Whats it waiting for? Changes to compile. Go make a change to the style.scss file and hit save. Now check the command line. You should see something like:

{% highlight bash linenos %}

Running "watch" task
Waiting...OK
>> File "styles/sass/style.scss" changed.

Running "compass:dev" (compass) task
   remove .sass-cache/ 
   remove styles/css/style.css 
   create styles/css/style.css (0.009s)
Compilation took 0.01s

Done, without errors.
Completed in 1.305s at Mon Sep 16 2013 22:31:48 GMT+0100 (BST) - Waiting...

{% endhighlight %}

The change should now be visible in your css file too! Huzzah. 

## Seperate Grunt tasks

The last thing we'll set up is a non-default task.

Now you can run any task in grunt by typing "grunt taskname:subtask" in the command line. For example to run our compass:prod task, we would enter:

{% highlight bash linenos %}

$ grunt compass:prod

{% endhighlight %}

That would be fine, but if you had a JS build for prod, or the aforementioned ftp deploy you wanted to run at the same time, that would be moer cumbersome to type into terminal.

Underneath the line of our default task, enter the following:

{% highlight js linenos %}
// PROD BUILD
grunt.registerTask('prod', ['compass:dev']);
{% endhighlight %}

Here we create a task called "prod" and add one task to be run when its called (our compass:prod task). Same rules apply as the default task, to add others, just add them in the order you want them performed (left to right), in quotes, comma seperated.

Go make a change to the Sass file and then run this in terminal: 

{% highlight bash linenos %}
$ grunt:prod
{% endhighlight %}

If everything worked, it should have recompiled, but compressed th eoutput CSS onto one line. 

## Automation work done = Cocktails

And we're done. Its a bit of work setting everything up, but now most of that is done and won't need so mch work next time. It'll be simple to take the Gruntfile and Package file and extend them to meet the needs of your next project. 

If I got anything wrong or you've any questions, tweet me. I'm generally not a dick.

Happy grunting. 

<a href="http://twitter.com/matthewbeta" class="signature">@matthewbeta</a>
