var exec = require("child_process").exec;
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var flatten = require("gulp-flatten");

gulp.task("browser-sync", function(cb) {
    browserSync.init({
        open: false,
        port: 9000,
        server: {
            baseDir: "./dist/"
        }
    });

    cb();
});

gulp.task("build", function(cb, a, b) {
    exec("yarn hackmyresume:build", function(err, stdout, stderr) {
        if (err) {
            console.error(`exec error: ${err}`);

            return cb();
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        return cb();
    });
});

gulp.task("watch-css", function(cb) {
    // Avoid rebuilding everything for css changes !
    gulp.watch(
        ["./src/**/*.css"],
        { usePolling: true },
        gulp.series([
            done => {
                gulp.src("./src/**/html.css")
                    .pipe(flatten())
                    .pipe(gulp.dest("./dist/"))
                    .pipe(browserSync.stream());

                done();
            }
        ])
    );
});

gulp.task("watch-tpl", function(cb) {
    gulp.watch(
        "src/**/*.{hbs,html,json}",
        { usePolling: true },
        gulp.series([
            done => {
                console.log("Changes detected");

                done();
            },
            "build",
            done => {
                browserSync.reload();
                done();
            }
        ])
    );
});

gulp.task(
    "default",
    gulp.series(gulp.parallel(["browser-sync", "watch-css", "watch-tpl"]))
);
