﻿// document.addEventListener('DOMContentLoaded', function() {
// 	var defaultConfig = {server_url: 'http://'}; // 默认配置
// 	// 读取数据，第一个参数是指定要读取的key以及设置默认值
// 	chrome.storage.sync.get(defaultConfig, function(items) {
// 		document.getElementById('server_url').value = items.server_url;
// 	});
// });

// document.getElementById('save').addEventListener('click', function() {
// 	var server_url = document.getElementById('server_url').value;
// 	// 这里貌似会存在刷新不及时的问题
// 	// chrome.extension.getBackgroundPage().showImage = showImage; // 让background即使生效
// 	chrome.storage.sync.set({server_url: server_url}, function() {
// 		// 注意新版的options页面alert不生效！
// 		alert('保存成功！');
// 		document.getElementById('status').textContent = '保存成功！';
// 		setTimeout(() => {document.getElementById('status').textContent = '';}, 800);
// 	});
// });

$(function () {
	// var statusDom = $('#status')
	var defaultConfig = {
		repo: 'https://api.github.com/repos/{owner}/{repo}',
		username: "committer user",
		email: "committer email",
		token: "",
	}; // 默认配置
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.sync.get(defaultConfig, function(items) {
		$('#repo').val(items.repo);
		$('#username').val(items.username);
		$('#email').val(items.email);
		$('#token').val(items.token);
	});

	$("#save").click(function(){
		
		var config = {
			repo: $('#repo').val(),
			username: $('#username').val(),
			email: $('#email').val(),
			token: $('#token').val(),
		}

		chrome.storage.sync.set(config, function() {
			// 注意新版的options页面alert不生效！
			// alert('保存成功！');
			$('#status').html('保存成功！');
			setTimeout(() => { $('#status').html(''); }, 800);
		});
	})
});