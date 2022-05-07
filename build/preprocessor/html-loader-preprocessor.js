const path = require('path');

const HTML_INCLUDE_PATTERN = /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi;

const nestedHtmlPreprocessor = (content, loaderContext, dir=null) => {
    return (HTML_INCLUDE_PATTERN.test(content) == false) ? (content) : (content.replace(HTML_INCLUDE_PATTERN, (m, src) => {
        const filePath = path.resolve(dir || loaderContext.context, src);

        loaderContext.dependency(filePath);

        return nestedHtmlPreprocessor(loaderContext.fs.readFileSync(filePath, 'utf8'), loaderContext, path.dirname(filePath));
    }));
};

module.exports = {
    'nestedHtmlPreprocessor': nestedHtmlPreprocessor
};