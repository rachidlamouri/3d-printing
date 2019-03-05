const fs = require('fs');

const VALID_WALL_TYPES = [
    'solid',
    'hollow',
];

const VALID_EXTENSIONS = [
    'stl',
    '123dx',
    'FCStd',
];

const files = fs.readdirSync('./standard-organizers/rectangles');
const invalidFilenames = [];

class StandardFile {
    constructor(filename) {
        const [name] = filename.split('.');
        const [dimensions = '', types = ''] = filename.split('-');

        const [smallDim, largeDim, height] = dimensions.split('x');
        const [wallType, extension] = types.split('.');

        Object.assign(this, {
            filename,
            name,
            smallDim,
            largeDim,
            height,
            wallType,
            extension,
        });
    }

    isValid() {
        return (
            this.smallDim !== undefined
            && this.largeDim !== undefined
            && this.height !== undefined
            && this.wallType !== undefined
            && this.extension !== undefined
            && VALID_EXTENSIONS.indexOf(this.extension) !== -1
            && VALID_WALL_TYPES.indexOf(this.wallType) !== -1
        );
    }
}

class FilePair {
    constructor(file) {
        Object.assign(this, {
            name: file.name,
            files: {
                [file.extension]: file,
            },
        });
    }

    add(file) {
        this.files[file.extension] = file;
    }

    isValid() {
        return this.getFileCount() === 2;
    }

    getFileCount() {
        return Object.keys(this.files).length;
    }
}

const filePairs = (
    files.map(filename => new StandardFile(filename))
    .reduce((filePairs, file) => {
        if(file.isValid()) {
            const {name} = file;
            if(filePairs[name] === undefined) {
                filePairs[name] = new FilePair(file);
            }

            filePairs[name].add(file);
        } else {
            invalidFilenames.push(file);
        }

        return filePairs;
    }, {})
);

if(invalidFilenames.length !== 0) {
    console.log('    Invalid filenames:');
    invalidFilenames.forEach(file => {
        console.log('        '+file.filename);
    })
}

const filesWithoutPairs = (
    Object.values(filePairs)
    .filter(filePair => !filePair.isValid())
    .map(filePair => {
        const [file] = Object.values(filePair.files);
        return file;
    })
);

if(filesWithoutPairs.length !== 0) {
    if(invalidFilenames.length !== 0) {
        console.log();
    }

    console.log('    Invalid file pairs:');
    filesWithoutPairs.forEach(file => {
        console.log('        '+file.filename);
    })
}

if(invalidFilenames.length === 0 && filesWithoutPairs.length === 0) {
    console.log('    All files are valid');
}
