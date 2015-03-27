!function ($) {
  /*
   翻页工具
   require plugin.css
   参数:
     pageFooter: 翻页工具栏选择器
     pageSize: 每页显示个数
     initPage：默认显示第几页
    */
  function PageFooter(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, this.defaults, options);
    this.init();
  }
  PageFooter.prototype = {
    constructor: PageFooter,
    defaults: {
      pageSize: 10,
      initPage: 1
    },
    init: function () {
      var $el = this.$element;
      this.$footer = $(this.options.pageFooter);
      this.$trs = $el.find("tbody tr");
      if (this.$trs.size() < this.options.pageSize) {
        return;
      }
      this.initFooter();
      this.show(this.options.initPage);
      this.$footer.on("click", "a", $.proxy(this.footerClick, this));
      this.$footer.on("keydown", "input", $.proxy(this.footerInput, this));
    },
    show: function (pageIndex) {
      if (pageIndex <= 0) pageIndex = 1;
      if (pageIndex > this.pageCount) pageIndex = this.pageCount;
      var $trs = this.$trs;
      var pageSize = this.options.pageSize;
      var from = (pageIndex - 1) * pageSize;
      var to = from + pageSize > $trs.size() ? $trs.size() : from + pageSize;
      var $shows = $trs.slice(from, to);
      $shows.show();
      $trs.not($shows).hide();
      this.currentIndex = pageIndex;
      this.showFooter(pageIndex);
    },
    footerClick: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $target = $(e.target);
      var toIndex = $target.data("index");
      if (toIndex == "pre") {
        toIndex = --this.currentIndex;
      }
      if (toIndex == "next") {
        toIndex = ++this.currentIndex;
      }
      this.show(toIndex);
    },
    footerInput: function (e) {
      if (e.which == 13) {
        var index = parseInt($(e.target).val());
        this.show(index);
      }
    },
    initFooter: function () {
      var $footer = this.$footer;
      var $trs = this.$trs;
      var pageCount = this.pageCount = Math.ceil($trs.size() / this.options.pageSize);
      var html = "";
      html += "<a class='n' data-index='1'>首页</a>";
      html += "<a class='n pre' data-index='pre'>上一页</a>";
      for (var i = 1; i <= pageCount; i++) {
        html += "<a data-index='" + i + "'>" + i + "</a>"
      }
      html += "<a class='n next' data-index='next'>下一页</a>";
      html += "<a class='n' data-index='" + pageCount + "'>尾页</a>";
      html += "<label>跳转到：</label><input type='text' class='gotoInput' maxlength='8'>";
      $footer.html(html);
    },
    showFooter: function (pageIndex) {
      var $footer = this.$footer;
      var $a = $footer.find("a").not(".n");
      var $shows = $a.slice((pageIndex - 3) < 0 ? 0 : (pageIndex - 3), (pageIndex + 2) <= 5 ? 5 : (pageIndex + 2));
      $a.removeClass("current");
      $a.eq(pageIndex - 1).addClass("current");
      $a.show();
      $a.not($shows).hide();
      //$shows.filter($a.first()).length ? $footer.find(".pre").hide() : $footer.find(".pre").show();
      //$shows.filter($a.last()).length ? $footer.find(".next").hide() : $footer.find(".next").show();
    }
  };
  $.fn.pageFooter = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('pageFooter'),
        options = $.extend({}, $this.data(), typeof option === 'object' && option);
      if (!data) $this.data('pageFooter', (data = new PageFooter(this, options)));
      if (typeof option == 'string') data[option].call($this)
    })
  };
} (window.jQuery)