var exec = require("child_process").exec;
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var flatten = require("gulp-flatten");
var nodemon = require("gulp-nodemon");

gulp.task("browser-sync", function (cb) {
    browserSync.init({
        open: false,
        proxy: "http://localhost:5000",
        files: ["dist/**/*.*"],
        port: 9000,
    });

    cb();
});

gulp.task("nodemon", function (cb) {
    var started = false;

    return nodemon({
        script: "./server.js",
    }).on("start", function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task("build", function (cb, a, b) {
    exec("yarn hackmyresume:build hackmyresume:dist", function (
        err,
        stdout,
        stderr
    ) {
        if (err) {
            console.error(`exec error: ${err}`);

            return cb();
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        return cb();
    });
});

gulp.task("watch-css", function (cb) {
    // Avoid rebuilding everything for css changes !
    gulp.watch(
        ["./src/**/*.css"],
        { usePolling: true },
        gulp.series([
            (done) => {
                gulp.src("./src/**/html.css")
                    .pipe(flatten())
                    .pipe(gulp.dest("./dist/"))
                    .pipe(browserSync.stream());

                done();
            },
        ])
    );
});

gulp.task("watch-tpl", function (cb) {
    gulp.watch(
        "src/**/*.{hbs,html,json}",
        { usePolling: true },
        gulp.series([
            (done) => {
                console.log("Changes detected");

                done();
            },
            "build",
            (done) => {
                browserSync.reload();
                done();
            },
        ])
    );
});

gulp.task(
    "default",
    gulp.series(
        gulp.parallel(["browser-sync", "nodemon", "watch-css", "watch-tpl"])
    )
);
