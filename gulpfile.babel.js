// generated on 2017-09-13 using generator-chrome-extension 0.6.1
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import es from 'event-stream';
import fs from 'fs';
import path from 'path';
import uglify from 'gulp-uglify-es';


const $ = gulpLoadPlugins();
let isProduction = false;

function lint(files) {
  return () =>
    gulp.src(files)
      .pipe($.eslint())
      .pipe($.eslint.format());
}

function readVersion() {
  return require('./src/manifest.json')
    .version
    .split('.');
}

function changeVersion(version) {
  gulp.src(['src/manifest.json'])
    .pipe($.jsonEditor(json => {
      json.version = version;
      return json;
    }))
    .pipe(gulp.dest('src'));
}

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function getFiles(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isFile();
    });
}

gulp.task('extras', () => {
  return gulp.src([
    'src/*.*',
    'src/_locales/**',
    'src/config.json',
    '!src/scripts',
    '!src/*.html'
  ], {
    base: 'src',
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('webix:style', () => {
  return gulp.src([
    'node_modules/webix/webix.css'
  ], {
    base: 'node_modules/webix',
    dot: true
  }).pipe(gulp.dest('dist/style'));
});

gulp.task('webix:fonts-copy', () => {
  return gulp.src([
    'node_modules/webix/fonts/*.*',
    '!node_modules/webix/fonts/*.txt'
  ], {
    base: 'node_modules/webix/fonts',
    dot: true
  }).pipe(gulp.dest('dist/style/fonts'));
});

gulp.task('webix:fonts-integrate', () => {
  const fontFiles = getFiles('dist/style/fonts').map(font => {
    return `style/fonts/${font}`;
  });

  return gulp.src('src/manifest.json')
    .pipe($.jsonEditor(json => {
      json.web_accessible_resources = [...json.web_accessible_resources, ...fontFiles];
      return json;
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', lint('src/scripts/**/*.js*'));

gulp.task('images', () => {
  if (isProduction) {
    return gulp.src('src/images/**/*')
      .pipe($.if($.if.isFile, $.cache($.imagemin({
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{ cleanupIDs: false }]
      }))
      .on('error', function (err) {
        console.info(err);
        this.end();
      })))
      .pipe(gulp.dest('dist/images'));
  }

  return gulp.src('src/images/**/*')
     .pipe(gulp.dest('dist/images'));
});

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'src', '.'] }))
    .pipe($.if(!isProduction, $.sourcemaps.init()))
    .pipe($.if('*.js', uglify()))
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe($.if('*.html', $.htmlmin({ removeComments: true, collapseWhitespace: true })))
    .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('src/manifest.json')
  .pipe($.if(isProduction, $.jsonEditor(json => {
    json.background.scripts = json.background.scripts.filter(script => {
      return script !== 'scripts/chromereload.js';
    });
    return json;
  })))
  .pipe(gulp.dest('dist'));
});

gulp.task('browserify', () => {
  const files = [
    'bg/background.js',
    'cs/contentscript.js',
    'pop/popup.js',
    'page/page.js',
    'chromereload.js'
  ];

  const tasks = files.map(file => {
    let filePath = `./src/scripts/${file}`;

    if (fs.existsSync(filePath)) {
      return browserify({
        extensions: ['.js', '.jsx', '.css'],
        entries: `./src/scripts/${file}`,
        debug: !isProduction
      }).transform('babelify')
        .transform('browserify-css', { global: true })
        .bundle()
        .pipe(source(file))
        .pipe($.if(isProduction, $.streamify(uglify({
          output: { 'ascii_only': true }
        }))))
        .pipe(gulp.dest('dist/scripts'));
    }

    return null;
  }).filter(element => element);

  return es.merge.apply(null, tasks);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['build:dev'], () => {
  $.livereload.listen();

  gulp.watch([
    'src/*.html',
    'src/scripts/**/*.js',
    'src/scripts/**/*.jsx',
    'src/images/**/*',
    'src/_locales/**/*.json',
    'modules/**/*'
  ]).on('change', $.livereload.reload);

  gulp.watch(['src/**/*', 'modules/**/*'], ['build:dev']);
});

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('build:pack', () => {
  let manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
      .pipe($.zip('SuperSMM-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('build:dev', cb => {
  isProduction = false;
  runSequence(
    'lint', 'clean', 'browserify', 'chromeManifest',
    ['html', 'images', 'extras'], cb);
});

gulp.task('build', cb => {
  isProduction = true;
  runSequence(
    'lint', 'clean', 'browserify', 'chromeManifest',
    ['html', 'images', 'extras'], 'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});

gulp.task('version:major', () => {
  let version = readVersion();
  version[0]++;
  version[1] = 0;
  version[2] = 0;

  changeVersion(version.join('.'));
});

gulp.task('version:minor', () => {
  let version = readVersion();
  version[1]++;
  version[2] = 0;

  changeVersion(version.join('.'));
});

gulp.task('version:patch', () => {
  let version = readVersion();
  version[2]++;

  changeVersion(version.join('.'));
});

 // Объединение манифестов модулей
gulp.task('module:merge-manifest', () => {
  let foldersModules = getFolders('modules');

  const modulesManifest = foldersModules.map(folder => {
    let moduleManifest = `modules/${folder}/manifest.json`;

    if (fs.existsSync(moduleManifest))
      return moduleManifest;

    return null;
  }).filter(element => element);

  return gulp.src(['dist/manifest.json', ...modulesManifest])
   .pipe($.mergeJson({ fileName: 'manifest.json', concatArrays: true }))
   .pipe(gulp.dest('dist'));
});

gulp.task('modules:integrate', () => {
  /**
   * TODO: Добавить интеграцию скриптов модулей для popup и page.
   */
  let foldersModules = getFolders('modules');

  function getModulesPatch(folders, moduleFile) {
    return folders.map(folder => {
      let modulePath = `modules/${folder}/${moduleFile}`;
      if (fs.existsSync(modulePath))
        return modulePath;

      return null;
    }).filter(element => element);
  }

  let bgPaths = getModulesPatch(foldersModules, 'bg/background.js');
  let csPaths = getModulesPatch(foldersModules, 'cs/contentscript.js');
  let popPaths = getModulesPatch(foldersModules, 'pop/popup.js');
  let pagePaths = getModulesPatch(foldersModules, 'page/page.js');

  gulp.src([...bgPaths, ...csPaths, ...popPaths, ...pagePaths],
    { base: '.' })
    .pipe(gulp.dest('dist'));

  gulp.src(['dist/manifest.json'])
    .pipe($.jsonEditor(json => {
      json.background.scripts = [...json.background.scripts, ...bgPaths];
      json.background.scripts = [...new Set(json.background.scripts)];

      json.content_scripts[0].js = [...json.content_scripts[0].js, ...csPaths];
      json.content_scripts[0].js = [...new Set(json.content_scripts[0].js)];

      return json;
    }))
    .pipe(gulp.dest('dist'));

  let localesExt = getFolders('src/_locales');

  localesExt.forEach(locale => {
    let localesModule = foldersModules.map(folder => {
      let modulePath = `modules/${folder}/_locales/${locale}/messages.json`;
      if (fs.existsSync(modulePath))
        return modulePath;

      return null;
    }).filter(element => element);

    // Иморт локализации модулей в расширение.
    if (localesModule.length) {
      gulp.src([`src/_locales/${locale}/messages.json`, ...localesModule])
        .pipe($.mergeJson({ fileName: 'messages.json' }))
        .pipe(gulp.dest(`dist/_locales/${locale}`));
    }
  });

  // Копирование изображений модулей в расширение
  let imagesModule = foldersModules.map(folder => {
    let modulePath = `modules/${folder}/images`;
    if (fs.existsSync(modulePath))
      return modulePath;

    return null;
  }).filter(element => element)
    .map(path => path + '/**/*');

  gulp.src(imagesModule).pipe(gulp.dest('dist/images'));
});