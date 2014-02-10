koala-jade
==========

A koala extension that adds support for compiling [jade](http://jade-lang.com/) files.  It's basically just a modified version of @zaygraveyard's [Dust Compiler](https://github.com/zaygraveyard/koala-dust) for koala, so I can't take credit for much aside from getting it to work with [Jade](http://jade-lang.com/).

How to build
------------

1. run `npm install`.
2. create a zip file.
3. add, to the zip, all files:
    * node_modules
    * jade.png
    * JadeCompiler.js
    * LICENSE
    * package.js
4. rename zip to `jade.koala-compiler`.

How to install
--------------

Drag-n-Drop `jade.koala-compiler` on the Koala application window.  If all goes well, you'll get a success message saying that the extension was installed.

Todo
----
  * The _pretty_ html output option is only working on the bundled version of jade at the moment.  I plan to get it working on the command-line version soon.
  * Very willing to hear other ideas on what people would like to see incorporated into the extension.