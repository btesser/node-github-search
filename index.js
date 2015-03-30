var http = require('https'),
	chalk = require('chalk'),
	keypress = require('keypress');
 
	keypress(process.stdin);
	function pbcopy(data) { var proc = require('child_process').spawn('pbcopy'); proc.stdin.write(data); proc.stdin.end(); }
	
	function GithubSearch() {
		// The API endpoint to search repositories on GitHub
		var url = 'https://api.github.com';
		var argv = process.argv.slice(2).join('+');

		var querystring = '?q=' + argv + 'language:javascript&per_page=5';
		http
			.request({
				host: 'api.github.com',
				headers: {
					'User-Agent': 'nodejs'
				},
				path: '/search/repositories' + querystring
			}, function(response) {
				var body = '';
				response
					.on('data', function(data) {
						body += data;
					})
					.on('end', function() {
						var results = JSON.parse(body).items;
						results.forEach(function(result, index) {
							console.log((index+1) + ')' + chalk.white.bgRed.bold(result.full_name) + ' - ' + chalk.magenta(result.description));
							console.log(chalk.red(result.html_url));
							console.log(chalk.green(result.ssh_url));
							console.log('\r');
						});
						process.stdin.on('keypress', function (read, ch) {
							var choice;

							if (read === '\r') { choice = 1; } else { choice = parseInt(read); }
							if (choice && !isNaN(choice) && choice > 0 && choice <= results.length) {
								pbcopy(results[choice - 1].ssh_url);
								console.log(chalk.green(results[choice - 1].ssh_url) + ' copied to clipboard');
							}
							// process.stdin.setRawMode(false);
							process.stdin.destroy();
 						});
						process.stdin.setRawMode(true);
						process.stdin.resume();
					}); 
			})
			.end();	
	}
	
	module.exports = GithubSearch;