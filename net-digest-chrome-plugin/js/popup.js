$(function () {

	var statusIntval = 0
	var statusDom = $('#status')
	var server_url = null
	var defaultConfig = { server_url: 'http://' }; // 默认配置
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.sync.get(defaultConfig, function (items) {
		server_url = items.server_url
		$('#server_url').html(server_url);
	});
	
	// 获取后台页标题
	chrome.tabs.getSelected(null, function (tab) {
		$('#get_background_title').val(tab.title);
		$('#get_background_url').val(tab.url);
	});

	var showStatus = function(msg){
		statusDom.html(msg);
		if (statusIntval){
			clearTimeout(statusIntval)
		}
		statusIntval = setTimeout(() => { statusDom.html(''); }, 800);
	}

	$('#form_submit').click(function () {

		let title = $('#get_background_title').val()
		let url = $('#get_background_url').val()
		
		$.ajax({
			type: 'POST',
			url: server_url,
			data: JSON.stringify({ url: url, title:title }),
			contentType: "application/json; charset=utf-8",
			success: () => {
				showStatus('保存成功');
			},
			error: (xhr, textStatus, errorThrown) => {
				try{
					showStatus(`保存失败:${textStatus}, ${xhr.responseText}`);
				}catch(e){

				}
			}
		});
	})

	
});

