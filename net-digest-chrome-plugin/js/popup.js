$(function () {

	var statusIntval = 0
	var statusDom = $('#status')
	var repoConfig = {
		repo: 'https://api.github.com/repos/{owner}/{repo}',
		username: "committer user",
		email: "committer email",
		token: "",
	}; // 默认配置
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.sync.get(repoConfig, function (items) {
		repoConfig = items
		$('#server_url').html(items.repo);
	});

	// 获取后台页标题
	chrome.tabs.getSelected(null, function (tab) {
		$('#get_background_title').val(tab.title);
		$('#get_background_url').val(tab.url);
	});

	var showStatus = function (msg) {
		statusDom.html(msg);
		if (statusIntval) {
			clearTimeout(statusIntval)
		}
		statusIntval = setTimeout(() => { statusDom.html(''); }, 1800);
	}

	var contents = {

		get: (filename, callback) => {

			$.ajax({
				type: 'GET',
				url: `${repoConfig.repo}/contents/${repoConfig.username}/${filename}`,
				dataType: "json",
				cache: false,
				contentType: "application/json; charset=utf-8",
				success: (res) => {
					callback && callback(res, true)
				},
				error: (xhr, textStatus, errorThrown) => {
					try {

						if (xhr.status == 404) {
							res = JSON.parse(xhr.responseText)
							if (res.message == "Not Found") {
								callback && callback(null, false)
								return
							}
						}
						showStatus(`访问文件失败:${textStatus}, ${xhr.responseText}`);

					} catch (e) {

					}
				}
			});
		},
		put: (filename, filesha, content) => {
			var data = {
				"message": "commit message",
				"branch": "master",
				"committer": {
					"name": `${repoConfig.username}`,
					"email": `${repoConfig.email}`
				},
				"content": Base64.encode(content)
			}

			if (filesha && filesha != "") {
				data["sha"] = `${filesha}`
			}

			// alert(JSON.stringify(data))

			$.ajax({
				type: 'PUT',
				headers: {
					'Authorization': `token ${repoConfig.token}`
				},
				url: `${repoConfig.repo}/contents/${repoConfig.username}/${filename}`,
				data: JSON.stringify(data),
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: (res) => {
					showStatus('保存成功');
				},
				error: (xhr, textStatus, errorThrown) => {
					try {
						showStatus(`保存失败:${textStatus}, ${xhr.responseText}`);
					} catch (e) {

					}
				}
			});
		}
	}

	$('#form_submit').click(function () {

		let title = $('#get_background_title').val()
		let url = $('#get_background_url').val()
		var m = new Date()
		var filename = `${m.getFullYear()}${("0" + (m.getMonth() + 1)).slice(-2)}${("0" + m.getDate()).slice(-2)}.json`
		var dateString = m.getFullYear() + "/" +
			("0" + (m.getMonth() + 1)).slice(-2) + "/" +
			("0" + m.getDate()).slice(-2) + " " +
			("0" + m.getHours()).slice(-2) + ":" +
			("0" + m.getMinutes()).slice(-2) + ":" +
			("0" + m.getSeconds()).slice(-2);

		var row = {
			title: title,
			url: url,
			ctime: dateString,
			timestamp: m.getTime()
		}

		if (url.indexOf("youtube.com/watch") != -1) {
			try {
				var urlObj = new URL(url)
				var params = new URLSearchParams(urlObj.search)
				var watchId = params.get("v")
				row["thrumb"] = [
					`http://i3.ytimg.com/vi/${watchId}/hqdefault.jpg`,
					`http://i3.ytimg.com/vi/${watchId}/maxresdefault.jpg`,
				]
			} catch (e) {

			}
		}

		contents.get(filename, (res, exist) => {
			try {
				if (!exist) {
					// 文件不存在
					contents.put(filename, "", JSON.stringify([row], null, 2))
				} else {

					// alert(JSON.stringify(res))
					//{"name":"20200806.json","path":"ujff888/20200806.json","sha":"be8450202a1f05d9896c0c12998dd3aec99aa443","size":152,"url":"https://api.github.com/repos/ujff888/chrome-plugin-demo/contents/ujff888/20200806.json?ref=master","html_url":"https://github.com/ujff888/chrome-plugin-demo/blob/master/ujff888/20200806.json","git_url":"https://api.github.com/repos/ujff888/chrome-plugin-demo/git/blobs/be8450202a1f05d9896c0c12998dd3aec99aa443","download_url":"https://raw.githubusercontent.com/ujff888/chrome-plugin-demo/master/ujff888/20200806.json","type":"file","content":"eyJ0aXRsZSI6ImpRdWVyeSBhamF4IC0gYWpheCgpIOaWueazlSIsInVybCI6\nImh0dHBzOi8vd3d3Lnczc2Nob29sLmNvbS5jbi9qcXVlcnkvYWpheF9hamF4\nLmFzcCIsImN0aW1lIjoiMjAyMC8wOC8wNiAxNDozODo1NyIsInRpbWVzdGFt\ncCI6MTU5NjcyNDczNzQ1NH0=\n","encoding":"base64","_links":{"self":"https://api.github.com/repos/ujff888/chrome-plugin-demo/contents/ujff888/20200806.json?ref=master","git":"https://api.github.com/repos/ujff888/chrome-plugin-demo/git/blobs/be8450202a1f05d9896c0c12998dd3aec99aa443","html":"https://github.com/ujff888/chrome-plugin-demo/blob/master/ujff888/20200806.json"}}
					sha = res.sha
					try {
						content = Base64.decode(res.content)
						data = JSON.parse(content)
						if (!(data instanceof Array)) {
							data = []
						}
						data.push(row)
						contents.put(filename, sha, JSON.stringify(data, null, 2))
					} catch (e) {
						alert(e)
					}

				}

			} catch (e) {

			}
		})
	})


});

