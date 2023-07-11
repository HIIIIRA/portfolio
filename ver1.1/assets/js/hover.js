$(function () {
  var userAgent = navigator.userAgent; // ユーザーエージェント判定
  let link, border; // 動く要素
  let touchArea = $(".js-hitbox"); //当たり判定用要素
  var list = $(".js-li-hover"); // liタグ要素代入
  // aタグを踏んだ時の端末判定とhover装飾
  if (
    userAgent.indexOf("iPhone") >= 0 ||
    userAgent.indexOf("iPad") >= 0 ||
    userAgent.indexOf("Android") >= 0
  ) {
    touchArea.on("touchstart", function () {
      link = $(this).find(".js-hover-link");
      border = $(this).find(".js-border");
      border.removeClass("is--not");
      link.removeClass("is--not");
      border.addClass("is--hovering");
      link.addClass("is--hovering");
    });
    touchArea.on("touchend", function () {
      link = $(this).find(".js-hover-link");
      border = $(this).find(".js-border");
      border.removeClass("is--hovering");
      link.removeClass("is--hovering");
      border.addClass("is--not");
      link.addClass("is--not");
    });
  } else {
    touchArea.hover(
      function () {
        link = $(this).find(".js-hover-link");
        border = $(this).find(".js-border");
        border.removeClass("is--not");
        link.removeClass("is--not");
        border.addClass("is--hovering");
        link.addClass("is--hovering");
      },
      function () {
        link = $(this).find(".js-hover-link");
        border = $(this).find(".js-border");
        border.removeClass("is--hovering");
        link.removeClass("is--hovering");
        border.addClass("is--not");
        link.addClass("is--not");
      }
    );
  }
});
