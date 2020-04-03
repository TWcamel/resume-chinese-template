#!env sh

workingDir="/tmp"
installDir="/usr/local/share"
targetDir="/usr/local/bin"

if [ "$(which phantomjs 1>/dev/null; echo $?)" -eq 1 ]; then
    echo 'PhantomJS not installed, installing...';
    apt-get update && apt-get install -y build-essential chrpath libssl-dev \
     libxft-dev libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev

    phantomJsFilename="phantomjs-2.1.1-linux-x86_64"
    curl -L "https://bitbucket.org/ariya/phantomjs/downloads/${phantomJsFilename}.tar.bz2" \
        -o "${workingDir}/${phantomJsFilename}.tar.bz2"

    tar xvjf "${workingDir}/${phantomJsFilename}.tar.bz2" -C $workingDir

    mv "${workingDir}/${phantomJsFilename}" $installDir
    ln -sf "${installDir}/${phantomJsFilename}/bin/phantomjs" $targetDir
fi

if [ "$(which wkhtmltopdf 1>/dev/null; echo $?)" -eq 1 ]; then
    fileName="wkhtmltox-0.12.4_linux-generic-amd64"
    curl -L "https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/${fileName}.tar.xz" \
        -o "${workingDir}/${fileName}.tar.xz"

    tar xvf "${workingDir}/${fileName}.tar.xz" -C $workingDir

    mv "${workingDir}/wkhtmltox" $installDir
    ln -sf "${installDir}/wkhtmltox/bin/wkhtmltopdf" $targetDir
fi

if [ "$(which weasyprint 1>/dev/null; echo $?)" -eq 1 ]; then
    apt-get install build-essential python3-dev python3-pip python3-setuptools \
        python3-wheel python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
        libgdk-pixbuf2.0-0 libffi-dev shared-mime-info

    pip3 install WeasyPrint
fi
