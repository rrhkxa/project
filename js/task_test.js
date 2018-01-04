/**
 * [爱卡大作业]
 * zhu.jianxin 2017.12.20
 */
$(function() {
	var baseUrl = "http://testclub.xcar.com.cn/ajax_xbb/";

	/**
	 * [pageJson description]
	 * @type {Object}
	 */
	var pageJson = {
		getmoreUrl: 'http://testclub.xcar.com.cn/task/getMore', //请求更多数据接口
		submitApplyUrl: 'http://testclub.xcar.com.cn/talent_task/talentApply', //验证达人接口
		detailGetMoreUrl: 'http://testclub.xcar.com.cn/task/getMoreDlists', //详情页面更多接口
		addFollowUrl: 'http://testclub.xcar.com.cn/task/addFocus', //任务详情页添加关注接口
		requireAppUrl: 'http://testclub.xcar.com.cn/talent_task/requireApp', //申请达人接口

		getMore: function(dom, currpage, pagesize, status, type) { //请求更多数据函数
			_this = dom;
			$.ajax({
					url: pageJson.getmoreUrl,
					type: 'POST',
					dataType: 'json',
					data: {
						currpage: currpage, //初始请求为2，请求的页数的数据
						pagesize: pagesize, //请求返回数据的条数
						status: status, //当前状态下
						type: type
					}
				})
				.done(function(data) {
					if (data.status == 1) {
						if (data.lists.length == 0 || data.lists === undefined) {
							if ($(".con_tab").eq($(_this).index()).find(".list_border li").length < 10) {
								$(".con_tab").eq($(_this).index()).find(".whole_box").hide();
								$(".con_tab").eq($(_this).index()).find(".load_txt").hide();
								$(".con_tab").eq($(_this).index()).find('.loading_list').hide();
							} else {
								$(".con_tab").eq($(_this).index()).find(".whole_box").show();
								$(".con_tab").eq($(_this).index()).find('.loading_list').hide();
								$(".con_tab").eq($(_this).index()).find(".load_txt").show().text("没有更多任务了~");
								
							}
						}
						if (data.lists.length > 0) {
							$(".con_tab").eq($(_this).index()).find('.loading_list').show();
							var html = '';
							$.each(data.lists, function(index, val) {
								html += '<li>';
								html += '	<a target="_blank" href="' + val.id + '.html" class="clearfix">';
								html += '        <div class="con_img">';
								html += '            <img data-src="' + val.head_figure + '" src="http://asserts.xcarimg.com/web/task/images/default135X90.png" width="135" height="90">';
								if (val.state == 1) {
									html += '			 <span class="ending"></span>';
								} else if (val.state == 2) {
									html += '			 <span class="end"></span>';
								}
								html += '        </div>';
								html += '        <div class="con_txt">';
								html += '            <table border="0" cellspacing="0" cellpadding="0">';
								html += '              <tbody><tr>';
								html += '                <td><span class="txt_tit">' + val.task_name + '</span>';
								html += '                <p class="par_con">' + val.describe + '</p></td>';
								html += '              </tr>';
								html += '            </tbody></table>';
								html += '        </div>';
								html += '        <div class="participate">';
								html += '        	<span class="par_num">';
								html += '            	<em>￥</em>';
								html += '                <i>' + val.total_amount + '</i>';
								html += '            </span>';
								html += '            <p class="par_intro">已有<i>' + val.nums + '</i>人参与<br>结束日期 ' + val.end_time + ' </p>';
								html += '        </div>';
								html += '    </a>';
								html += '</li>';
							});

							$(".con_tab").eq($(_this).index()).find(".list_border").append(html);
							
							currpage++
							_this.attr({
								"data-currpage": currpage
							});
							 $(".con_img img").lazyload({
						        //placeholder : "http://icon.xcar.com.cn/2011newcar/images/auto/ps_logo.jpg",
						        effect: "fadeIn" //show(直接显示),fadeIn(淡入),slideDown(下拉)
						    });
						}
					}
				})


		},
		submitApply: function(dom, username, phone, wechat, declaration, works_url) { //申请资格函数
			_this = dom;
			$.ajax({
					url: pageJson.submitApplyUrl,
					type: 'POST',
					dataType: 'json',
					data: {
						username: username,
						phone: phone,
						wechat: wechat,
						declaration: declaration,
						works_url: works_url
					}
				})
				.done(function(data) {
					if (data.code == 1) {
						$("#userName").val('');
						$("#userPhone").val('');
						$("#wxNumber").val('');
						$("#infoText").val('');
						$("#hrefLink").val('');
						$(".applysub").hide();
						$(".graybg_pop").hide();
						transfer_pop(".state_pop", ".graybg_pop") //对话框
						$(".graybg_pop").show();
						$(".state_pop").show();
						$("#state_pop").find(".pop_tit").text(data.msg);

					} else {
						transfer_pop(".state_pop", ".graybg_pop") //对话框
						$(".graybg_pop").show();
						$(".state_pop").show();
						$(".applysub").hide();
						$("#state_pop").find(".pop_tit").text(data.msg);
					}
				})

		},
		detailGetMore: function(dom, detailcurrpage, detailpagesize, taskId) { //详情页面更多函数
			_that = dom;
			$.ajax({
					url: pageJson.detailGetMoreUrl,
					type: 'POST',
					dataType: 'json',
					data: {
						currpage: detailcurrpage,
						pagesize: detailpagesize,
						task_id: taskId
					}
				})
				.done(function(data) {
					if (data.status == 1) {
						if (data.dlists.length == 0 || data.dlists === undefined) {
							if ($(".append_list .all_task").length < 10) {
								$(".con_tab").eq(1).find(".load_txt").hide();
								$(".con_tab").eq(1).find(".loading_list").hide();
							} else {
								$(".con_tab").eq(1).find(".loading_list").hide();
								$(".con_tab").eq(1).find(".load_txt").show().text("没有更多大作业了~");
								
							}
						}
						if (data.dlists.length > 0) {
							$(".con_tab").eq(1).find(".loading_list").show();
							var html = '';
							$.each($(data.dlists), function(index, val) {
								html += '<div class="all_task">';
								html += '<div class="list_user">';
								html += '<div class="list_user_img"><a  data-authorid='+ val.authorurl + '><img src="' + val.avatar + '" width="40" height="40" onerror=javascript:this.src="http://image1.xcarimg.com/attachments/my/default/120.jpg"></a></div>';
								html += '<div class="list_user_txt"><a ' + val.authorurl + '>' + val.author + '</a></div>';
								if (val.isdisplay) {
									html += '<a href="javascript:;" class="follow" data-authorid ="' + val.authorid + '">关注</a>';
								}
								html += '</div>';
								html += '<div class="detail_con">';
								html += '<a target="_blank" href="http://www97.xcar.com.cn/bbs/viewthread.php?tid=' + val.tid + '">'
								html += '<p>' + val.subject + '</p>';
								if (data.imagenum == 3) {
									html += '<ul class="varied_img">';
									$.each(val.message, function(index, valimg) {
										if (!valimg['image']) {
											html += '<li><img src="http://asserts.xcarimg.com/web/task/images/small_detail.png" width="200" height="150"></li>';
										} else {
											html += '<li><img src="http://asserts.xcarimg.com/web/task/images/default200x150.png" data-src="' + valimg['image'] + '" data-width="' + valimg['width'] + '" data-height="' + valimg['height'] + '"></li>';
										}

									});
									html += '</ul>';
								} else if (data.imagenum == 1) {
									html += '<ul class="varied_pic">';
									$.each(val.message, function(index, valimg) {
										if (valimg == 'null') {
											html += '<li><img src="http://asserts.xcarimg.com/web/task/images/big_detail.png" width="620"></li>';
										} else {
											html += '<li><img src="http://image.xcar.com.cn/attachments/a/day_171228/2017122809_f09b1b21ef61bb9253bdsY1lojo7eVEk.jpg" data-src="' + val.message[0]['image'] + '" data-width="' + val.message[0]['width'] + '" data-height="' + val.message[0]['height'] + '"></li>';
										}
									});
									html += '</ul>';
								}
								html += '<div class="comment clearfix">';
								html += '<em class="detail_icon list_infor">' + val.views + '</em>';
								html += '<em class="infor_icon">' + val.replies + '</em>';
								html += '</div>';
								html += '</a>';
								html += '</div>';
								html += '</div>';
							});

							$(".con_tab").eq(1).find(".append_list").append(html);
							detailcurrpage++
							_that.attr({
								"data-currpage": detailcurrpage
							});
							$(".varied_pic img , .varied_img img").lazyload({
						        //placeholder : "http://icon.xcar.com.cn/2011newcar/images/auto/ps_logo.jpg",
						        effect: "fadeIn" //show(直接显示),fadeIn(淡入),slideDown(下拉)
						    });
							pageJson.imgCount(".varied_pic img", 620, 310);
							pageJson.imgCount(".varied_img img", 200, 150);

						}
					}
				})
				.fail(function(data) {})

		},
		addFollow: function(dom, uid, authorId) { //加关注
			_thit = dom;
			$.ajax({
					url: pageJson.addFollowUrl,
					type: 'POST',
					dataType: 'json',
					data: {
						uid: uid,
						author_id: authorId
					}
				})
				.done(function(data) {
					if (data.res == 1 || data.res == 3) {
						_thit.hide();
					}
				})
				.fail(function() {})

		},
		debounce: function(fn, delay) { //滚动防抖动
			// debounce函数用来包裹我们的事件在事件触发的两秒后，我们包裹在debounce中的函数才会被触发
			// 持久化一个定时器 loadTimer
			var loadTimer = null;
			// 闭包函数可以访问 loadTimer
			return function() {
				// 通过 'this' 和 'arguments'
				// 获得函数的作用域和参数
				var context = this;
				var args = arguments;
				// 如果事件被触发，清除 loadTimer 并重新开始计时
				clearTimeout(loadTimer);
				loadTimer = setTimeout(function() {
					fn.apply(context, args);
				}, delay);
			}

		},
		getDetail: function() { //加载更多调取函数
			if ($(document).scrollTop() >= $(document).height() - $(window).height() - 200) {
				if ($(".detail_con").length > 0) { //详情页ajax请求
					if (!$(".con_tab").eq(0).is(':visible')) {
						var $selfIndex = $(".detail_con"),
							detailcurrpage = $selfIndex.attr('data-currpage'),
							detailpagesize = $selfIndex.attr('data-pagesize'),
							taskId = $selfIndex.attr('data-taskid');
							
							pageJson.detailGetMore($selfIndex, detailcurrpage, detailpagesize, taskId);
					}
				} else { //列表页ajax请求
					var $self = $(".lf_cur"),
						currpage = $self.attr('data-currpage'),
						pagesize = $self.attr('data-pagesize'),
						status = $self.attr('data-status'),
						type = $self.attr('data-type') ? $self.attr('data-type') : '';

						pageJson.getMore($self, currpage, pagesize, status, type);
				}
			}

		},
		imgCount:function(varIedImg, maxWidth, maxHeight){ //详情页图片处理
			var ratio = 0;
			for (var i = 0; i < $(varIedImg).length; i++) {
				var width = $(varIedImg).eq(i).attr("data-width"),
					height = $(varIedImg).eq(i).attr("data-height"),
					valInch = (maxWidth / maxHeight),
					newInch = (width / height),
					equal = newInch.toFixed(2) == valInch.toFixed(2),
					greater = newInch.toFixed(2) > valInch.toFixed(2);
				if (width != 0 && height != 0) {
					if (equal) {
						$(varIedImg).eq(i).css({
							"width": maxWidth,
							"height": maxHeight
						});
					} else if (greater) {
						var ratio = maxHeight / height
						$(varIedImg).eq(i).css({
							"width": width * ratio,
							"height": maxHeight,
							"margin-left": -(width * ratio - maxWidth) / 2
						});
					} else {
						var ratio = maxWidth / width
						$(varIedImg).eq(i).css({
							"width": maxWidth,
							"height": height * ratio,
							"margin-top": -(height * ratio - maxHeight) / 2
						});
					}
				}
			} 

		},
		oCarXin:function(topClick, bottClick, cliActive){//tab切换
			$(topClick).click(function() {
				var oIndexTit = $(this).index(topClick);
				$(bottClick).eq(oIndexTit).show().siblings().hide();
				$(this).addClass(cliActive).siblings().removeClass(cliActive);
			})
		}
	}

	//cookie
	var Cookie = {
		getExpiresDate: function(days, hours, minutes) {
			var ExpiresDate = new Date();
			if (typeof days == "number" && typeof hours == "number" &&
				typeof hours == "number") {
				ExpiresDate.setDate(ExpiresDate.getDate() + parseInt(days));
				ExpiresDate.setHours(ExpiresDate.getHours() + parseInt(hours));
				ExpiresDate.setMinutes(ExpiresDate.getMinutes() + parseInt(minutes));
				return ExpiresDate.toGMTString();
			}
		},
		_getValue: function(offset) {
			var endstr = document.cookie.indexOf(";", offset);
			if (endstr == -1) {
				endstr = document.cookie.length;
			}
			return unescape(document.cookie.substring(offset, endstr));
		},
		get: function(name) {
			var arg = name + "=";
			var alen = arg.length;
			var clen = document.cookie.length;
			var i = 0;
			while (i < clen) {
				var j = i + alen;
				if (document.cookie.substring(i, j) == arg) {
					return this._getValue(j);
				}
				i = document.cookie.indexOf(" ", i) + 1;
				if (i == 0) break;
			}
			return "";
		},
		set: function(name, value, expires, path, domain, secure) {
			document.cookie = name + "=" + escape(value) +
				((expires) ? "; expires=" + expires : "") +
				((path) ? "; path=" + path : "") +
				((domain) ? "; domain=" + domain : "") +
				((secure) ? "; secure" : "");
		},
		remove: function(name, path, domain) {
			if (this.get(name)) {
				document.cookie = name + "=" +
					((path) ? "; path=" + path : "") +
					((domain) ? "; domain=" + domain : "") +
					"; expires=Thu, 01-Jan-70 00:00:01 GMT";
			}
		},
		clear: function() {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++)
				var cookieName = cookies[i].split('=')[0];
			if (cookieName == 'ProductListIds') {
				this.remove(cookieName);
			}
		}
	}



	// tab调取
	pageJson.oCarXin('.lf_nav a', '.con_list .con_tab', 'lf_cur')

	// 点击加载全部按钮事件
	$(".whole_ing").click(function() {

		$(".con_tab").eq(1).show().siblings().hide();
		$(".lf_nav a").eq(1).addClass("lf_cur").siblings().removeClass("lf_cur");
		$('html,body').prop('scrollTop', 386);

	})

	// 滚动响应加载更多
	$(window).scroll(pageJson.debounce(pageJson.getDetail, 100));


	//详情页头像
	$('body').on('click', '.list_user_img ,.list_user_txt', function(event) {
			if (Cookie.get("_discuz_uid") == undefined || Cookie.get("_discuz_uid") == null || Cookie.get("_discuz_uid") == '') {
				$(".list_user_img").unbind();
				$(".list_user_img").xLoginBox({
					show: true,
					step: 3
				});
			}else{
				var authorid = $(this).find("a").attr('data-authorid');
				var detailsUid = 'http://my.xcar.com.cn/space.php?uid='+ authorid;
				$(this).find("a").attr({"href":detailsUid,"target":"_blank"})
			}

		})
		.on('click', '.follow', function(event) { //关注
			event.preventDefault();
			var authorId = $(this).attr("data-authorid"),
				discuzUid = Cookie.get("_discuz_uid");
			if (Cookie.get("_discuz_uid") == undefined || Cookie.get("_discuz_uid") == null || Cookie.get("_discuz_uid") == '') {
				$(".follow").unbind();
				$(".follow").xLoginBox({
					show: true,
					step: 3
				});
			} else {
				pageJson.addFollow($(this), discuzUid, authorId)
			}

		});


	//表单验证
	if ($("#applyForm").length > 0) {

		var validator = $("#applyForm").validate({
			debug: true,
			ignore: ".ignore",
			rules: {
				userName: {
					required: true,
					maxlength: 15
				},
				userPhone: {
					required: true,
					maxlength: 11,
					isMobile: true
				},
				wxNumber: {
					required: true,
					maxlength: 20
				},
				infoText: {
					required: true,
					maxlength: 300
				}
			},
			messages: {
				userName: {
					required: "请输入真实姓名",
					maxlength: "请输入正确的姓名"
				},
				userPhone: {
					required: "请输入手机号",
					maxlength: "请输入正确的手机号",
					isMobile: "请输入正确的手机号",
					//number: "请输入有效的数字",
				},
				wxNumber: {
					required: "请输入微信号",
					maxlength: "请输入正确的微信号"

				},
				infoText: {
					required: "请填写参赛宣言",
					maxlength: "参赛宣言最多300个字"
				}
			},
			submitHandler: function(form) {
				pageJson.submitApply($('.git_apply'), $.trim($('#userName').val()), $('#userPhone').val(), $.trim($('#wxNumber').val()), $.trim($('#infoText').val()), $.trim($('#hrefLink').val()));
			}
		});
		$('.apply_txt,.txtare').on('focusout', function(event) {
			event.preventDefault();
			var $self = $(this),
				val = $self.val();
			$.trim($self.val()) == '' ? $self.val('') : $self.val(val);
		});
	}

	// 微信号校验事件
	$('#wxNumber').on('keyup', function(event) {
		event.preventDefault();
		if ($.trim($(this).val()) !== '') {
			$(this).removeClass('ignore');
		} else {
			$(this).addClass('ignore').removeClass('error').siblings('label.error').hide();
		}
	});

	//弹窗居中定位
	function transfer_pop(popBox, graybgPop) {
		var popHeight = $(popBox).height();
		var popWidth = $(popBox).width();
		$(popBox).css({
			"margin-left": -(popWidth / 2),
			"margin-top": -(popHeight / 2)
		});
		$(popBox).show();
		$(graybgPop).show();
	}


	//申请资格按钮事件
	$("body").on('click', '.task_tijiao', function(e) {
			e.preventDefault();
			if (Cookie.get("_discuz_uid") == undefined || Cookie.get("_discuz_uid") == null || Cookie.get("_discuz_uid") == '') {
				$(".task_tijiao").unbind();
				$(".task_tijiao").xLoginBox({
					func: function() {
						callLoginScript();
						$.ajax({
							url: baseUrl + 'isNoSpeak/' + Cookie.getCookie("_discuz_uid"),
							type: "POST",
							dataType: 'json',
							success: function(data) {

								if (data.status == 1) {
									// $(".mark-shut").show();
									// setTimeout(function() {
									// 	$(".mark-shut").hide();
									// 	window.location.reload();
									// }, 1500);
									// return;
									transfer_pop(".state_pop", ".graybg_pop") //对话框
									$(".graybg_pop").show();
									$(".state_pop").show();
									$("#state_pop").find(".pop_tit").text(data.msg);

									
								}

							}
						})
					},
					show: true,
					step: 2
				});
			} else {
				$(".task_tijiao").unbind();
				$(".task_tijiao").xLoginBox({
					func: function() {
						$.ajax({
							url: baseUrl + 'isNoSpeak/' + Cookie.get("_discuz_uid"),
							type: "POST",
							dataType: 'json',
							data: {
								param1: 'value1'
							},
							success: function(data) {
								if (data.status == 0) {
									var taskIdApply = $(".detail_con").attr("data-taskid")
									$.ajax({
											url: pageJson.requireAppUrl,
											type: 'POST',
											dataType: 'json',
											data: {
												type: 1,
												task_id: taskIdApply
											}
										})
										.done(function(data) {
											if (data.code == 1) {
												transfer_pop(".applysub", ".graybg_pop") //对话框
												$(".graybg_pop").show();
												$(".applysub").show();
											} else {
												transfer_pop(".state_pop", ".graybg_pop") //对话框
												$(".graybg_pop").show();
												$(".state_pop").show();
												$("#state_pop").find(".pop_tit").text(data.msg);
											}
										})
								}
								/* 禁言 */
								if (data.status == 1) {
									// $(".mark-shut").show();
									// setTimeout(function() {
									// 	$(".mark-shut").hide();
									// 	//window.location.reload();
									// }, 1500);
									// return;
									transfer_pop(".state_pop", ".graybg_pop") //对话框
									$(".graybg_pop").show();
									$(".state_pop").show();
									$("#state_pop").find(".pop_tit").text(data.msg);
								}
								/* 禁言end */
							}

						})
					},
					show: true,
					step: 2
				});
			}

		})
		// 领取任务按钮事件
		.on('click', '.task_receive', function(e) {
			e.preventDefault();
			receThit = $(this)
			if (Cookie.get("_discuz_uid") == undefined || Cookie.get("_discuz_uid") == null || Cookie.get("_discuz_uid") == '') {
				$(".task_receive").unbind();
				$(".task_receive").xLoginBox({
					func: function() {
						$.ajax({
							url: baseUrl + 'isNoSpeak/' + Cookie.getCookie("_discuz_uid"),
							type: "POST",
							dataType: 'json',
							success: function(data) {
								if (data.status == 0) {} else {
									if (data.status == 1) {
										// $(".mark-shut").show();
										// setTimeout(function() {
										// 	$(".mark-shut").hide();
										// 	window.location.reload();
										// }, 1500);
										// return;
										transfer_pop(".state_pop", ".graybg_pop") //对话框
										$(".graybg_pop").show();
										$(".state_pop").show();
										$("#state_pop").find(".pop_tit").text(data.msg);
									}
								}
							}
						})
					},
					show: true,
					step: 2
				});
			} else {
				$(".task_receive").unbind();
				$(".task_receive").xLoginBox({
					func: function() {
						$.ajax({
							url: baseUrl + 'isNoSpeak/' + Cookie.get("_discuz_uid"),
							type: "POST",
							dataType: 'json',
							data: {
								param1: 'value1'
							},
							success: function(data) {
								if (data.status == 0) {
									var taskIdApply = $(".detail_con").attr("data-taskid")
									$.ajax({
											url: pageJson.requireAppUrl,
											type: 'POST',
											dataType: 'json',
											data: {
												type: 2,
												task_id: taskIdApply
											}
										})
										.done(function(data) {
											if (data.code == 1) {
												var dataFid = receThit.attr("data-fid"),
													dataTask = receThit.attr("data-task")
												window.location.href = ("http://www97.xcar.com.cn/bbs/post.php?action=newthread&fid=" + dataFid + "&task_id=" + dataTask + "&big_task=yes&extra=page%3D1")
											} else {
												transfer_pop(".state_pop", ".graybg_pop") //对话框
												$(".graybg_pop").show();
												$(".state_pop").show();
												$("#state_pop").find(".pop_tit").text(data.msg);
											}
										})
								}
								/* 禁言 */
								if (data.status == 1) {
									// $(".mark-shut").show();
									// setTimeout(function() {
									// 	$(".mark-shut").hide();
									// 	//window.location.reload();
									// }, 1500);
									// return;
									transfer_pop(".state_pop", ".graybg_pop") //对话框
									$(".graybg_pop").show();
									$(".state_pop").show();
									$("#state_pop").find(".pop_tit").text(data.msg);
								}
								/* 禁言end */
							}

						})
					},
					show: true,
					step: 2
				});
			}

		}) //登录弹框关闭按钮事件
		.on('click', '.pop_close', function(event) {
			event.preventDefault();
			$(".graybg_pop").hide();
			$(".apply_pop").hide();
			validator.resetForm();
			$('.apply_txt,.txtare').val('');
			if (o.toString().indexOf("Internet") == -1) {
				$(".infor_txt").hide();
			} else {
				$(".infor_txt").show();
			};
			$('#wxNumber').addClass('ignore');

		}) 
		.on('click', '.reload_close', function(event) {
			event.preventDefault();
			$(".graybg_pop").hide();
			$(".state_pop").hide();
			window.location.reload();
		})
		.on('click', '.state_konw', function(event) {
			event.preventDefault();
			$(".graybg_pop").hide();
			$(".state_pop").hide();
			window.location.reload();

		});

	$("#xlogin").on("click", function() {
		$("#xlogin").unbind();
		$("#xlogin").xLoginBox({
			func: function() {
				$("#xlogininfo").attr("style", "");
				callLoginScript.call(null);
				reloadMsgInfo.call(null);
				window.location.reload();
			},
			args: [],
			show: true

		})
	})

	window.callLoginScript = function() {
		var _script_id = "updateHeaderLoginScript";
		var o = document.getElementById(_script_id);
		if (o) {
			o.parentNode.removeChild(o);
		}
		var _url = 'http://www.xcar.com.cn/site_js/header/new_login_2015.php?t=' + Date.parse(new Date());
		loadScript({
			url: _url,
			id: _script_id,
			callback: function() {}
		});
		window.location.reload();
	} 

	/**
	 * 详情页图片处理调取
	 */
	pageJson.imgCount(".varied_pic img", 620, 310);
	pageJson.imgCount(".varied_img img", 200, 150);
	/**
	 * 懒加载处理图片
	 */
	 $(".con_img img,.varied_pic img , .varied_img img").lazyload({
        //placeholder : "http://icon.xcar.com.cn/2011newcar/images/auto/ps_logo.jpg",
        effect: "fadeIn" //show(直接显示),fadeIn(淡入),slideDown(下拉)
    });

	/* IE浏览器的输入框提示placeholder */
	var spuer = $("#applyForm .apply_txt")
	var o = navigator.appName;
	if (o.toString().indexOf("Internet") == -1) {
		$(".infor_txt").hide()
	} else {
		$(".infor_txt").show()
	};
	$("body").on('click', '.infor_txt', function(event) {
		event.preventDefault();
		$(this).siblings().trigger("focus");
	});
	//监听键盘按下
	$("#applyForm .apply_txt").bind('keypress', function() {
		var oIndex = $(this).index("#applyForm .apply_txt");
		$(this).parent().find(".infor_txt").hide()
	})
	$("#applyForm .apply_txt").focus(function() {
		$(this).parent().find(".infor_txt").hide();
		if ($(this).val() != '') {
			if (o.toString().indexOf("Internet") != -1) {
				$(this).parent().find(".infor_txt").hide();
			}
		}
	})
	$("#applyForm .apply_txt").blur(function() {
		if ($(this).val() == '') {
			$(this).css("color", "#777777");
			if (o.toString().indexOf("Internet") != -1) {
				$(this).parent().find(".infor_txt").show();
			}
		} else {
			$(this).css("color", "#777777");
			$(this).parent().find(".infor_txt").hide();
		}
	})
	spuer.val('');
});