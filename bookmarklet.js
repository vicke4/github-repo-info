function bytesToSize(bytes) {
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    for (var i = 0; i < sizes.length; i++) {
        if (bytes <= 1024) {
            return bytes + ' ' + sizes[i];
        } else {
            bytes = parseFloat(bytes / 1024).toFixed(2);
        }
    };

    return bytes + ' PB';
}

function fetchRepoDetails(url, pathArray, rateLimited, withoutToken) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        var resp = null;
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) resp = JSON.parse(xmlHttp.responseText);
            else if (!rateLimited && xmlHttp.status === 403) return fetchRepoDetails(url, pathArray, true, true);

            if (!resp) {
                if (xmlHttp.status === 403) {
                    return alert('Rate limit happened you\'re done for the day, you\'ll ' +
                            ' be able to use it normally tomorrow');
                }

                var githubPage = ['pulls', 'issues', 'marketplace', 'explore', 'settings',
                'contact', 'community', 'about', 'features'].indexOf(pathArray[1]) > -1;

                if (pathArray.length > 2 && !githubPage) {
                    var promptMsg = 'Repository not found. If you want this bookmarklet to work for ' +
                    'private or private organisation repositories click OK or press ENTER key to read the guide.';

                    if (window.confirm(promptMsg)) {
                        window.open('https://syncwithtech.org/github-repos-size-creation-date/#privateorganizationrepositories');
                    }
                } else {
                    alert('Not a valid GitHub repository page');
                }

                return;
            }

            var date = new Date(resp.created_at);
            var dateArr = date.toString().split(' ').splice(1, 3);
            dateArr[1] += ',';
            var text = 'Created on: ' + dateArr.join(' ') +
                '\nSize: ' + bytesToSize(resp.size * 1024);
            alert(text);
        }
    };

    xmlHttp.open('GET', url);
    /**
     * Uncomment and replace abc with your token in the next line to
     * make this bookmarklet work for private or private organization respositories
     *
     */
    /* xmlHttp.setRequestHeader('Authorization', 'token abc'); */
    xmlHttp.send();
}

function evaluate() {
    if (window.location.host !== 'github.com') {
        alert('Not a valid GitHub page.');
        return
    }

    var pathArray = window.location.pathname.split('/');
    var url = 'https://api.github.com/repos' + pathArray.slice(0, 3).join('/');
    fetchRepoDetails(url, pathArray);
}

evaluate();
