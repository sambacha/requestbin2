/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!(function ($) {
  // jshint ;_;

  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(() => {
    $.support.transition = (function () {
      const transitionEnd = (function () {
        const el = document.createElement("bootstrap");
        const transEndEventNames = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend",
        };
        let name;

        for (name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return transEndEventNames[name];
          }
        }
      })();

      return (
        transitionEnd && {
          end: transitionEnd,
        }
      );
    })();
  });
})(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!(function ($) {
  // jshint ;_;

  /* ALERT CLASS DEFINITION
   * ====================== */

  const dismiss = '[data-dismiss="alert"]';
  const Alert = function (el) {
    $(el).on("click", dismiss, this.close);
  };

  Alert.prototype.close = function (e) {
    const $this = $(this);
    let selector = $this.attr("data-target");
    let $parent;

    if (!selector) {
      selector = $this.attr("href");
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ""); // strip for ie7
    }

    $parent = $(selector);

    e && e.preventDefault();

    $parent.length ||
      ($parent = $this.hasClass("alert") ? $this : $this.parent());

    $parent.trigger((e = $.Event("close")));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass("in");

    function removeElement() {
      $parent.trigger("closed").remove();
    }

    $.support.transition && $parent.hasClass("fade")
      ? $parent.on($.support.transition.end, removeElement)
      : removeElement();
  };

  /* ALERT PLUGIN DEFINITION
   * ======================= */

  const old = $.fn.alert;

  $.fn.alert = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("alert");
      if (!data) $this.data("alert", (data = new Alert(this)));
      if (typeof option === "string") data[option].call($this);
    });
  };

  $.fn.alert.Constructor = Alert;

  /* ALERT NO CONFLICT
   * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  /* ALERT DATA-API
   * ============== */

  $(document).on("click.alert.data-api", dismiss, Alert.prototype.close);
})(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!(function ($) {
  // jshint ;_;

  /* BUTTON PUBLIC CLASS DEFINITION
   * ============================== */

  const Button = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.button.defaults, options);
  };

  Button.prototype.setState = function (state) {
    const d = "disabled";
    const $el = this.$element;
    const data = $el.data();
    const val = $el.is("input") ? "val" : "html";

    state += "Text";
    data.resetText || $el.data("resetText", $el[val]());

    $el[val](data[state] || this.options[state]);

    // push to event loop to allow forms to submit
    setTimeout(() => {
      state == "loadingText"
        ? $el.addClass(d).attr(d, d)
        : $el.removeClass(d).removeAttr(d);
    }, 0);
  };

  Button.prototype.toggle = function () {
    const $parent = this.$element.closest('[data-toggle="buttons-radio"]');

    $parent && $parent.find(".active").removeClass("active");

    this.$element.toggleClass("active");
  };

  /* BUTTON PLUGIN DEFINITION
   * ======================== */

  const old = $.fn.button;

  $.fn.button = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("button");
      const options = typeof option === "object" && option;
      if (!data) $this.data("button", (data = new Button(this, options)));
      if (option == "toggle") data.toggle();
      else if (option) data.setState(option);
    });
  };

  $.fn.button.defaults = {
    loadingText: "loading...",
  };

  $.fn.button.Constructor = Button;

  /* BUTTON NO CONFLICT
   * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  /* BUTTON DATA-API
   * =============== */

  $(document).on("click.button.data-api", "[data-toggle^=button]", (e) => {
    let $btn = $(e.target);
    if (!$btn.hasClass("btn")) $btn = $btn.closest(".btn");
    $btn.button("toggle");
  });
})(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!(function ($) {
  // jshint ;_;

  /* CAROUSEL CLASS DEFINITION
   * ========================= */

  const Carousel = function (element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find(".carousel-indicators");
    this.options = options;
    this.options.pause == "hover" &&
      this.$element
        .on("mouseenter", $.proxy(this.pause, this))
        .on("mouseleave", $.proxy(this.cycle, this));
  };

  Carousel.prototype = {
    cycle(e) {
      if (!e) this.paused = false;
      if (this.interval) clearInterval(this.interval);
      this.options.interval &&
        !this.paused &&
        (this.interval = setInterval(
          $.proxy(this.next, this),
          this.options.interval
        ));
      return this;
    },

    getActiveIndex() {
      this.$active = this.$element.find(".item.active");
      this.$items = this.$active.parent().children();
      return this.$items.index(this.$active);
    },

    to(pos) {
      const activeIndex = this.getActiveIndex();
      const that = this;

      if (pos > this.$items.length - 1 || pos < 0) return;

      if (this.sliding) {
        return this.$element.one("slid", () => {
          that.to(pos);
        });
      }

      if (activeIndex == pos) {
        return this.pause().cycle();
      }

      return this.slide(
        pos > activeIndex ? "next" : "prev",
        $(this.$items[pos])
      );
    },

    pause(e) {
      if (!e) this.paused = true;
      if (
        this.$element.find(".next, .prev").length &&
        $.support.transition.end
      ) {
        this.$element.trigger($.support.transition.end);
        this.cycle(true);
      }
      clearInterval(this.interval);
      this.interval = null;
      return this;
    },

    next() {
      if (this.sliding) return;
      return this.slide("next");
    },

    prev() {
      if (this.sliding) return;
      return this.slide("prev");
    },

    slide(type, next) {
      const $active = this.$element.find(".item.active");
      let $next = next || $active[type]();
      const isCycling = this.interval;
      const direction = type == "next" ? "left" : "right";
      const fallback = type == "next" ? "first" : "last";
      const that = this;
      let e;

      this.sliding = true;

      isCycling && this.pause();

      $next = $next.length ? $next : this.$element.find(".item")[fallback]();

      e = $.Event("slide", {
        relatedTarget: $next[0],
        direction,
      });

      if ($next.hasClass("active")) return;

      if (this.$indicators.length) {
        this.$indicators.find(".active").removeClass("active");
        this.$element.one("slid", () => {
          const $nextIndicator = $(
            that.$indicators.children()[that.getActiveIndex()]
          );
          $nextIndicator && $nextIndicator.addClass("active");
        });
      }

      if ($.support.transition && this.$element.hasClass("slide")) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $next.addClass(type);
        $next[0].offsetWidth; // force reflow
        $active.addClass(direction);
        $next.addClass(direction);
        this.$element.one($.support.transition.end, () => {
          $next.removeClass([type, direction].join(" ")).addClass("active");
          $active.removeClass(["active", direction].join(" "));
          that.sliding = false;
          setTimeout(() => {
            that.$element.trigger("slid");
          }, 0);
        });
      } else {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $active.removeClass("active");
        $next.addClass("active");
        this.sliding = false;
        this.$element.trigger("slid");
      }

      isCycling && this.cycle();

      return this;
    },
  };

  /* CAROUSEL PLUGIN DEFINITION
   * ========================== */

  const old = $.fn.carousel;

  $.fn.carousel = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("carousel");
      const options = $.extend(
        {},
        $.fn.carousel.defaults,
        typeof option === "object" && option
      );
      const action = typeof option === "string" ? option : options.slide;
      if (!data) $this.data("carousel", (data = new Carousel(this, options)));
      if (typeof option === "number") data.to(option);
      else if (action) data[action]();
      else if (options.interval) data.pause().cycle();
    });
  };

  $.fn.carousel.defaults = {
    interval: 5000,
    pause: "hover",
  };

  $.fn.carousel.Constructor = Carousel;

  /* CAROUSEL NO CONFLICT
   * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  /* CAROUSEL DATA-API
   * ================= */

  $(document).on(
    "click.carousel.data-api",
    "[data-slide], [data-slide-to]",
    function (e) {
      const $this = $(this);
      let href;
      const $target = $(
        $this.attr("data-target") ||
          ((href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""))
      ); // strip for ie7
      const options = $.extend({}, $target.data(), $this.data());
      let slideIndex;

      $target.carousel(options);

      if ((slideIndex = $this.attr("data-slide-to"))) {
        $target.data("carousel").pause().to(slideIndex).cycle();
      }

      e.preventDefault();
    }
  );
})(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!(function ($) {
  // jshint ;_;

  /* COLLAPSE PUBLIC CLASS DEFINITION
   * ================================ */

  const Collapse = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.collapse.defaults, options);

    if (this.options.parent) {
      this.$parent = $(this.options.parent);
    }

    this.options.toggle && this.toggle();
  };

  Collapse.prototype = {
    constructor: Collapse,

    dimension() {
      const hasWidth = this.$element.hasClass("width");
      return hasWidth ? "width" : "height";
    },

    show() {
      let dimension;
      let scroll;
      let actives;
      let hasData;

      if (this.transitioning || this.$element.hasClass("in")) return;

      dimension = this.dimension();
      scroll = $.camelCase(["scroll", dimension].join("-"));
      actives = this.$parent && this.$parent.find("> .accordion-group > .in");

      if (actives && actives.length) {
        hasData = actives.data("collapse");
        if (hasData && hasData.transitioning) return;
        actives.collapse("hide");
        hasData || actives.data("collapse", null);
      }

      this.$element[dimension](0);
      this.transition("addClass", $.Event("show"), "shown");
      $.support.transition &&
        this.$element[dimension](this.$element[0][scroll]);
    },

    hide() {
      let dimension;
      if (this.transitioning || !this.$element.hasClass("in")) return;
      dimension = this.dimension();
      this.reset(this.$element[dimension]());
      this.transition("removeClass", $.Event("hide"), "hidden");
      this.$element[dimension](0);
    },

    reset(size) {
      const dimension = this.dimension();

      this.$element.removeClass("collapse")[dimension](size || "auto")[0]
        .offsetWidth;

      this.$element[size !== null ? "addClass" : "removeClass"]("collapse");

      return this;
    },

    transition(method, startEvent, completeEvent) {
      const that = this;
      const complete = function () {
        if (startEvent.type == "show") that.reset();
        that.transitioning = 0;
        that.$element.trigger(completeEvent);
      };

      this.$element.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) return;

      this.transitioning = 1;

      this.$element[method]("in");

      $.support.transition && this.$element.hasClass("collapse")
        ? this.$element.one($.support.transition.end, complete)
        : complete();
    },

    toggle() {
      this[this.$element.hasClass("in") ? "hide" : "show"]();
    },
  };

  /* COLLAPSE PLUGIN DEFINITION
   * ========================== */

  const old = $.fn.collapse;

  $.fn.collapse = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("collapse");
      const options = $.extend(
        {},
        $.fn.collapse.defaults,
        $this.data(),
        typeof option === "object" && option
      );
      if (!data) $this.data("collapse", (data = new Collapse(this, options)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.collapse.defaults = {
    toggle: true,
  };

  $.fn.collapse.Constructor = Collapse;

  /* COLLAPSE NO CONFLICT
   * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  /* COLLAPSE DATA-API
   * ================= */

  $(document).on("click.collapse.data-api", "[data-toggle=collapse]", function (
    e
  ) {
    const $this = $(this);
    let href;
    const target =
      $this.attr("data-target") ||
      e.preventDefault() ||
      ((href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "")); // strip for ie7
    const option = $(target).data("collapse") ? "toggle" : $this.data();
    $this[$(target).hasClass("in") ? "addClass" : "removeClass"]("collapsed");
    $(target).collapse(option);
  });
})(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!(function ($) {
  // jshint ;_;

  /* DROPDOWN CLASS DEFINITION
   * ========================= */

  const toggle = "[data-toggle=dropdown]";
  const Dropdown = function (element) {
    const $el = $(element).on("click.dropdown.data-api", this.toggle);
    $("html").on("click.dropdown.data-api", () => {
      $el.parent().removeClass("open");
    });
  };

  Dropdown.prototype = {
    constructor: Dropdown,

    toggle(e) {
      const $this = $(this);
      let $parent;
      let isActive;

      if ($this.is(".disabled, :disabled")) return;

      $parent = getParent($this);

      isActive = $parent.hasClass("open");

      clearMenus();

      if (!isActive) {
        if ("ontouchstart" in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>')
            .insertBefore($(this))
            .on("click", clearMenus);
        }
        $parent.toggleClass("open");
      }

      $this.focus();

      return false;
    },

    keydown(e) {
      let $this;
      let $items;
      let $active;
      let $parent;
      let isActive;
      let index;

      if (!/(38|40|27)/.test(e.keyCode)) return;

      $this = $(this);

      e.preventDefault();
      e.stopPropagation();

      if ($this.is(".disabled, :disabled")) return;

      $parent = getParent($this);

      isActive = $parent.hasClass("open");

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus();
        return $this.click();
      }

      $items = $("[role=menu] li:not(.divider):visible a", $parent);

      if (!$items.length) return;

      index = $items.index($items.filter(":focus"));

      if (e.keyCode == 38 && index > 0) index--; // up
      if (e.keyCode == 40 && index < $items.length - 1) index++; // down
      if (!~index) index = 0;

      $items.eq(index).focus();
    },
  };

  function clearMenus() {
    $(".dropdown-backdrop").remove();
    $(toggle).each(function () {
      getParent($(this)).removeClass("open");
    });
  }

  function getParent($this) {
    let selector = $this.attr("data-target");
    let $parent;

    if (!selector) {
      selector = $this.attr("href");
      selector =
        selector &&
        /#/.test(selector) &&
        selector.replace(/.*(?=#[^\s]*$)/, ""); // strip for ie7
    }

    $parent = selector && $(selector);

    if (!$parent || !$parent.length) $parent = $this.parent();

    return $parent;
  }

  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  const old = $.fn.dropdown;

  $.fn.dropdown = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("dropdown");
      if (!data) $this.data("dropdown", (data = new Dropdown(this)));
      if (typeof option === "string") data[option].call($this);
    });
  };

  $.fn.dropdown.Constructor = Dropdown;

  /* DROPDOWN NO CONFLICT
   * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on("click.dropdown.data-api", clearMenus)
    .on("click.dropdown.data-api", ".dropdown form", (e) => {
      e.stopPropagation();
    })
    .on("click.dropdown.data-api", toggle, Dropdown.prototype.toggle)
    .on(
      "keydown.dropdown.data-api",
      `${toggle}, [role=menu]`,
      Dropdown.prototype.keydown
    );
})(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!(function ($) {
  // jshint ;_;

  /* MODAL CLASS DEFINITION
   * ====================== */

  const Modal = function (element, options) {
    this.options = options;
    this.$element = $(element).delegate(
      '[data-dismiss="modal"]',
      "click.dismiss.modal",
      $.proxy(this.hide, this)
    );
    this.options.remote &&
      this.$element.find(".modal-body").load(this.options.remote);
  };

  Modal.prototype = {
    constructor: Modal,

    toggle() {
      return this[!this.isShown ? "show" : "hide"]();
    },

    show() {
      const that = this;
      const e = $.Event("show");

      this.$element.trigger(e);

      if (this.isShown || e.isDefaultPrevented()) return;

      this.isShown = true;

      this.escape();

      this.backdrop(() => {
        const transition =
          $.support.transition && that.$element.hasClass("fade");

        if (!that.$element.parent().length) {
          that.$element.appendTo(document.body); // don't move modals dom position
        }

        that.$element.show();

        if (transition) {
          that.$element[0].offsetWidth; // force reflow
        }

        that.$element.addClass("in").attr("aria-hidden", false);

        that.enforceFocus();

        transition
          ? that.$element.one($.support.transition.end, () => {
              that.$element.focus().trigger("shown");
            })
          : that.$element.focus().trigger("shown");
      });
    },

    hide(e) {
      e && e.preventDefault();

      const that = this;

      e = $.Event("hide");

      this.$element.trigger(e);

      if (!this.isShown || e.isDefaultPrevented()) return;

      this.isShown = false;

      this.escape();

      $(document).off("focusin.modal");

      this.$element.removeClass("in").attr("aria-hidden", true);

      $.support.transition && this.$element.hasClass("fade")
        ? this.hideWithTransition()
        : this.hideModal();
    },

    enforceFocus() {
      const that = this;
      $(document).on("focusin.modal", (e) => {
        if (
          that.$element[0] !== e.target &&
          !that.$element.has(e.target).length
        ) {
          that.$element.focus();
        }
      });
    },

    escape() {
      const that = this;
      if (this.isShown && this.options.keyboard) {
        this.$element.on("keyup.dismiss.modal", (e) => {
          e.which == 27 && that.hide();
        });
      } else if (!this.isShown) {
        this.$element.off("keyup.dismiss.modal");
      }
    },

    hideWithTransition() {
      const that = this;
      const timeout = setTimeout(() => {
        that.$element.off($.support.transition.end);
        that.hideModal();
      }, 500);

      this.$element.one($.support.transition.end, () => {
        clearTimeout(timeout);
        that.hideModal();
      });
    },

    hideModal() {
      const that = this;
      this.$element.hide();
      this.backdrop(() => {
        that.removeBackdrop();
        that.$element.trigger("hidden");
      });
    },

    removeBackdrop() {
      this.$backdrop && this.$backdrop.remove();
      this.$backdrop = null;
    },

    backdrop(callback) {
      const that = this;
      const animate = this.$element.hasClass("fade") ? "fade" : "";

      if (this.isShown && this.options.backdrop) {
        const doAnimate = $.support.transition && animate;

        this.$backdrop = $(
          `<div class="modal-backdrop ${animate}" />`
        ).appendTo(document.body);

        this.$backdrop.click(
          this.options.backdrop == "static"
            ? $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
        );

        if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

        this.$backdrop.addClass("in");

        if (!callback) return;

        doAnimate
          ? this.$backdrop.one($.support.transition.end, callback)
          : callback();
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass("in");

        $.support.transition && this.$element.hasClass("fade")
          ? this.$backdrop.one($.support.transition.end, callback)
          : callback();
      } else if (callback) {
        callback();
      }
    },
  };

  /* MODAL PLUGIN DEFINITION
   * ======================= */

  const old = $.fn.modal;

  $.fn.modal = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("modal");
      const options = $.extend(
        {},
        $.fn.modal.defaults,
        $this.data(),
        typeof option === "object" && option
      );
      if (!data) $this.data("modal", (data = new Modal(this, options)));
      if (typeof option === "string") data[option]();
      else if (options.show) data.show();
    });
  };

  $.fn.modal.defaults = {
    backdrop: true,
    keyboard: true,
    show: true,
  };

  $.fn.modal.Constructor = Modal;

  /* MODAL NO CONFLICT
   * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  /* MODAL DATA-API
   * ============== */

  $(document).on("click.modal.data-api", '[data-toggle="modal"]', function (e) {
    const $this = $(this);
    const href = $this.attr("href");
    const $target = $(
      $this.attr("data-target") || (href && href.replace(/.*(?=#[^\s]+$)/, ""))
    ); // strip for ie7
    const option = $target.data("modal")
      ? "toggle"
      : $.extend(
          { remote: !/#/.test(href) && href },
          $target.data(),
          $this.data()
        );

    e.preventDefault();

    $target.modal(option).one("hide", () => {
      $this.focus();
    });
  });
})(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!(function ($) {
  // jshint ;_;

  /* TOOLTIP PUBLIC CLASS DEFINITION
   * =============================== */

  const Tooltip = function (element, options) {
    this.init("tooltip", element, options);
  };

  Tooltip.prototype = {
    constructor: Tooltip,

    init(type, element, options) {
      let eventIn;
      let eventOut;
      let triggers;
      let trigger;
      let i;

      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.enabled = true;

      triggers = this.options.trigger.split(" ");

      for (i = triggers.length; i--; ) {
        trigger = triggers[i];
        if (trigger == "click") {
          this.$element.on(
            `click.${this.type}`,
            this.options.selector,
            $.proxy(this.toggle, this)
          );
        } else if (trigger != "manual") {
          eventIn = trigger == "hover" ? "mouseenter" : "focus";
          eventOut = trigger == "hover" ? "mouseleave" : "blur";
          this.$element.on(
            `${eventIn}.${this.type}`,
            this.options.selector,
            $.proxy(this.enter, this)
          );
          this.$element.on(
            `${eventOut}.${this.type}`,
            this.options.selector,
            $.proxy(this.leave, this)
          );
        }
      }

      this.options.selector
        ? (this._options = $.extend({}, this.options, {
            trigger: "manual",
            selector: "",
          }))
        : this.fixTitle();
    },

    getOptions(options) {
      options = $.extend(
        {},
        $.fn[this.type].defaults,
        this.$element.data(),
        options
      );

      if (options.delay && typeof options.delay === "number") {
        options.delay = {
          show: options.delay,
          hide: options.delay,
        };
      }

      return options;
    },

    enter(e) {
      const { defaults } = $.fn[this.type];
      const options = {};
      let self;

      this._options &&
        $.each(
          this._options,
          (key, value) => {
            if (defaults[key] != value) options[key] = value;
          },
          this
        );

      self = $(e.currentTarget)[this.type](options).data(this.type);

      if (!self.options.delay || !self.options.delay.show) return self.show();

      clearTimeout(this.timeout);
      self.hoverState = "in";
      this.timeout = setTimeout(() => {
        if (self.hoverState == "in") self.show();
      }, self.options.delay.show);
    },

    leave(e) {
      const self = $(e.currentTarget)[this.type](this._options).data(this.type);

      if (this.timeout) clearTimeout(this.timeout);
      if (!self.options.delay || !self.options.delay.hide) return self.hide();

      self.hoverState = "out";
      this.timeout = setTimeout(() => {
        if (self.hoverState == "out") self.hide();
      }, self.options.delay.hide);
    },

    show() {
      let $tip;
      let pos;
      let actualWidth;
      let actualHeight;
      let placement;
      let tp;
      const e = $.Event("show");

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip = this.tip();
        this.setContent();

        if (this.options.animation) {
          $tip.addClass("fade");
        }

        placement =
          typeof this.options.placement === "function"
            ? this.options.placement.call(this, $tip[0], this.$element[0])
            : this.options.placement;

        $tip.detach().css({ top: 0, left: 0, display: "block" });

        this.options.container
          ? $tip.appendTo(this.options.container)
          : $tip.insertAfter(this.$element);

        pos = this.getPosition();

        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;

        switch (placement) {
          case "bottom":
            tp = {
              top: pos.top + pos.height,
              left: pos.left + pos.width / 2 - actualWidth / 2,
            };
            break;
          case "top":
            tp = {
              top: pos.top - actualHeight,
              left: pos.left + pos.width / 2 - actualWidth / 2,
            };
            break;
          case "left":
            tp = {
              top: pos.top + pos.height / 2 - actualHeight / 2,
              left: pos.left - actualWidth,
            };
            break;
          case "right":
            tp = {
              top: pos.top + pos.height / 2 - actualHeight / 2,
              left: pos.left + pos.width,
            };
            break;
        }

        this.applyPlacement(tp, placement);
        this.$element.trigger("shown");
      }
    },

    applyPlacement(offset, placement) {
      const $tip = this.tip();
      const width = $tip[0].offsetWidth;
      const height = $tip[0].offsetHeight;
      let actualWidth;
      let actualHeight;
      let delta;
      let replace;

      $tip.offset(offset).addClass(placement).addClass("in");

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      if (placement == "top" && actualHeight != height) {
        offset.top = offset.top + height - actualHeight;
        replace = true;
      }

      if (placement == "bottom" || placement == "top") {
        delta = 0;

        if (offset.left < 0) {
          delta = offset.left * -2;
          offset.left = 0;
          $tip.offset(offset);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, "left");
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, "top");
      }

      if (replace) $tip.offset(offset);
    },

    replaceArrow(delta, dimension, position) {
      this.arrow().css(
        position,
        delta ? `${50 * (1 - delta / dimension)}%` : ""
      );
    },

    setContent() {
      const $tip = this.tip();
      const title = this.getTitle();

      $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
      $tip.removeClass("fade in top bottom left right");
    },

    hide() {
      const that = this;
      const $tip = this.tip();
      const e = $.Event("hide");

      this.$element.trigger(e);
      if (e.isDefaultPrevented()) return;

      $tip.removeClass("in");

      function removeWithAnimation() {
        const timeout = setTimeout(() => {
          $tip.off($.support.transition.end).detach();
        }, 500);

        $tip.one($.support.transition.end, () => {
          clearTimeout(timeout);
          $tip.detach();
        });
      }

      $.support.transition && this.$tip.hasClass("fade")
        ? removeWithAnimation()
        : $tip.detach();

      this.$element.trigger("hidden");

      return this;
    },

    fixTitle() {
      const $e = this.$element;
      if (
        $e.attr("title") ||
        typeof $e.attr("data-original-title") !== "string"
      ) {
        $e.attr("data-original-title", $e.attr("title") || "").attr(
          "title",
          ""
        );
      }
    },

    hasContent() {
      return this.getTitle();
    },

    getPosition() {
      const el = this.$element[0];
      return $.extend(
        {},
        typeof el.getBoundingClientRect === "function"
          ? el.getBoundingClientRect()
          : {
              width: el.offsetWidth,
              height: el.offsetHeight,
            },
        this.$element.offset()
      );
    },

    getTitle() {
      let title;
      const $e = this.$element;
      const o = this.options;

      title =
        $e.attr("data-original-title") ||
        (typeof o.title === "function" ? o.title.call($e[0]) : o.title);

      return title;
    },

    tip() {
      return (this.$tip = this.$tip || $(this.options.template));
    },

    arrow() {
      return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
    },

    validate() {
      if (!this.$element[0].parentNode) {
        this.hide();
        this.$element = null;
        this.options = null;
      }
    },

    enable() {
      this.enabled = true;
    },

    disable() {
      this.enabled = false;
    },

    toggleEnabled() {
      this.enabled = !this.enabled;
    },

    toggle(e) {
      const self = e
        ? $(e.currentTarget)[this.type](this._options).data(this.type)
        : this;
      self.tip().hasClass("in") ? self.hide() : self.show();
    },

    destroy() {
      this.hide().$element.off(`.${this.type}`).removeData(this.type);
    },
  };

  /* TOOLTIP PLUGIN DEFINITION
   * ========================= */

  const old = $.fn.tooltip;

  $.fn.tooltip = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("tooltip");
      const options = typeof option === "object" && option;
      if (!data) $this.data("tooltip", (data = new Tooltip(this, options)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.tooltip.Constructor = Tooltip;

  $.fn.tooltip.defaults = {
    animation: true,
    placement: "top",
    selector: false,
    template:
      '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: "hover focus",
    title: "",
    delay: 0,
    html: false,
    container: false,
  };

  /* TOOLTIP NO CONFLICT
   * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
})(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */

!(function ($) {
  // jshint ;_;

  /* POPOVER PUBLIC CLASS DEFINITION
   * =============================== */

  const Popover = function (element, options) {
    this.init("popover", element, options);
  };

  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {
    constructor: Popover,

    setContent() {
      const $tip = this.tip();
      const title = this.getTitle();
      const content = this.getContent();

      $tip.find(".popover-title")[this.options.html ? "html" : "text"](title);
      $tip
        .find(".popover-content")
        [this.options.html ? "html" : "text"](content);

      $tip.removeClass("fade top bottom left right in");
    },

    hasContent() {
      return this.getTitle() || this.getContent();
    },

    getContent() {
      let content;
      const $e = this.$element;
      const o = this.options;

      content =
        (typeof o.content === "function" ? o.content.call($e[0]) : o.content) ||
        $e.attr("data-content");

      return content;
    },

    tip() {
      if (!this.$tip) {
        this.$tip = $(this.options.template);
      }
      return this.$tip;
    },

    destroy() {
      this.hide().$element.off(`.${this.type}`).removeData(this.type);
    },
  });

  /* POPOVER PLUGIN DEFINITION
   * ======================= */

  const old = $.fn.popover;

  $.fn.popover = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("popover");
      const options = typeof option === "object" && option;
      if (!data) $this.data("popover", (data = new Popover(this, options)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.popover.Constructor = Popover;

  $.fn.popover.defaults = $.extend({}, $.fn.tooltip.defaults, {
    placement: "right",
    trigger: "click",
    content: "",
    template:
      '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
  });

  /* POPOVER NO CONFLICT
   * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
})(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */

!(function ($) {
  // jshint ;_;

  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy(element, options) {
    const process = $.proxy(this.process, this);
    const $element = $(element).is("body") ? $(window) : $(element);
    let href;
    this.options = $.extend({}, $.fn.scrollspy.defaults, options);
    this.$scrollElement = $element.on("scroll.scroll-spy.data-api", process);
    this.selector = `${
      this.options.target ||
      ((href = $(element).attr("href")) &&
        href.replace(/.*(?=#[^\s]+$)/, "")) || // strip for ie7
      ""
    } .nav li > a`;
    this.$body = $("body");
    this.refresh();
    this.process();
  }

  ScrollSpy.prototype = {
    constructor: ScrollSpy,

    refresh() {
      const self = this;
      let $targets;

      this.offsets = $([]);
      this.targets = $([]);

      $targets = this.$body
        .find(this.selector)
        .map(function () {
          const $el = $(this);
          const href = $el.data("target") || $el.attr("href");
          const $href = /^#\w/.test(href) && $(href);
          return (
            ($href &&
              $href.length && [
                [
                  $href.position().top +
                    (!$.isWindow(self.$scrollElement.get(0)) &&
                      self.$scrollElement.scrollTop()),
                  href,
                ],
              ]) ||
            null
          );
        })
        .sort((a, b) => a[0] - b[0])
        .each(function () {
          self.offsets.push(this[0]);
          self.targets.push(this[1]);
        });
    },

    process() {
      const scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
      const scrollHeight =
        this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight;
      const maxScroll = scrollHeight - this.$scrollElement.height();
      const { offsets } = this;
      const { targets } = this;
      const { activeTarget } = this;
      let i;

      if (scrollTop >= maxScroll) {
        return activeTarget != (i = targets.last()[0]) && this.activate(i);
      }

      for (i = offsets.length; i--; ) {
        activeTarget != targets[i] &&
          scrollTop >= offsets[i] &&
          (!offsets[i + 1] || scrollTop <= offsets[i + 1]) &&
          this.activate(targets[i]);
      }
    },

    activate(target) {
      let active;
      let selector;

      this.activeTarget = target;

      $(this.selector).parent(".active").removeClass("active");

      selector = `${this.selector}[data-target="${target}"],${this.selector}[href="${target}"]`;

      active = $(selector).parent("li").addClass("active");

      if (active.parent(".dropdown-menu").length) {
        active = active.closest("li.dropdown").addClass("active");
      }

      active.trigger("activate");
    },
  };

  /* SCROLLSPY PLUGIN DEFINITION
   * =========================== */

  const old = $.fn.scrollspy;

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("scrollspy");
      const options = typeof option === "object" && option;
      if (!data) $this.data("scrollspy", (data = new ScrollSpy(this, options)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.scrollspy.Constructor = ScrollSpy;

  $.fn.scrollspy.defaults = {
    offset: 10,
  };

  /* SCROLLSPY NO CONFLICT
   * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  /* SCROLLSPY DATA-API
   * ================== */

  $(window).on("load", () => {
    $('[data-spy="scroll"]').each(function () {
      const $spy = $(this);
      $spy.scrollspy($spy.data());
    });
  });
})(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */

!(function ($) {
  // jshint ;_;

  /* TAB CLASS DEFINITION
   * ==================== */

  const Tab = function (element) {
    this.element = $(element);
  };

  Tab.prototype = {
    constructor: Tab,

    show() {
      const $this = this.element;
      const $ul = $this.closest("ul:not(.dropdown-menu)");
      let selector = $this.attr("data-target");
      let previous;
      let $target;
      let e;

      if (!selector) {
        selector = $this.attr("href");
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ""); // strip for ie7
      }

      if ($this.parent("li").hasClass("active")) return;

      previous = $ul.find(".active:last a")[0];

      e = $.Event("show", {
        relatedTarget: previous,
      });

      $this.trigger(e);

      if (e.isDefaultPrevented()) return;

      $target = $(selector);

      this.activate($this.parent("li"), $ul);
      this.activate($target, $target.parent(), () => {
        $this.trigger({
          type: "shown",
          relatedTarget: previous,
        });
      });
    },

    activate(element, container, callback) {
      const $active = container.find("> .active");
      const transition =
        callback && $.support.transition && $active.hasClass("fade");

      function next() {
        $active
          .removeClass("active")
          .find("> .dropdown-menu > .active")
          .removeClass("active");

        element.addClass("active");

        if (transition) {
          element[0].offsetWidth; // reflow for transition
          element.addClass("in");
        } else {
          element.removeClass("fade");
        }

        if (element.parent(".dropdown-menu")) {
          element.closest("li.dropdown").addClass("active");
        }

        callback && callback();
      }

      transition ? $active.one($.support.transition.end, next) : next();

      $active.removeClass("in");
    },
  };

  /* TAB PLUGIN DEFINITION
   * ===================== */

  const old = $.fn.tab;

  $.fn.tab = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("tab");
      if (!data) $this.data("tab", (data = new Tab(this)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.tab.Constructor = Tab;

  /* TAB NO CONFLICT
   * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  /* TAB DATA-API
   * ============ */

  $(document).on(
    "click.tab.data-api",
    '[data-toggle="tab"], [data-toggle="pill"]',
    function (e) {
      e.preventDefault();
      $(this).tab("show");
    }
  );
})(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!(function ($) {
  // jshint ;_;

  /* TYPEAHEAD PUBLIC CLASS DEFINITION
   * ================================= */

  const Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.updater = this.options.updater || this.updater;
    this.source = this.options.source;
    this.$menu = $(this.options.menu);
    this.shown = false;
    this.listen();
  };

  Typeahead.prototype = {
    constructor: Typeahead,

    select() {
      const val = this.$menu.find(".active").attr("data-value");
      this.$element.val(this.updater(val)).change();
      return this.hide();
    },

    updater(item) {
      return item;
    },

    show() {
      const pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight,
      });

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height,
          left: pos.left,
        })
        .show();

      this.shown = true;
      return this;
    },

    hide() {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup(event) {
      let items;

      this.query = this.$element.val();

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      items = $.isFunction(this.source)
        ? this.source(this.query, $.proxy(this.process, this))
        : this.source;

      return items ? this.process(items) : this;
    },

    process(items) {
      const that = this;

      items = $.grep(items, (item) => that.matcher(item));

      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }

      return this.render(items.slice(0, this.options.items)).show();
    },

    matcher(item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter(items) {
      const beginswith = [];
      const caseSensitive = [];
      const caseInsensitive = [];
      let item;

      while ((item = items.shift())) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {
          beginswith.push(item);
        } else if (~item.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter(item) {
      const query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
      return item.replace(
        new RegExp(`(${query})`, "ig"),
        ($1, match) => `<strong>${match}</strong>`
      );
    },

    render(items) {
      const that = this;

      items = $(items).map((i, item) => {
        i = $(that.options.item).attr("data-value", item);
        i.find("a").html(that.highlighter(item));
        return i[0];
      });

      items.first().addClass("active");
      this.$menu.html(items);
      return this;
    },

    next(event) {
      const active = this.$menu.find(".active").removeClass("active");
      let next = active.next();

      if (!next.length) {
        next = $(this.$menu.find("li")[0]);
      }

      next.addClass("active");
    },

    prev(event) {
      const active = this.$menu.find(".active").removeClass("active");
      let prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find("li").last();
      }

      prev.addClass("active");
    },

    listen() {
      this.$element
        .on("focus", $.proxy(this.focus, this))
        .on("blur", $.proxy(this.blur, this))
        .on("keypress", $.proxy(this.keypress, this))
        .on("keyup", $.proxy(this.keyup, this));

      if (this.eventSupported("keydown")) {
        this.$element.on("keydown", $.proxy(this.keydown, this));
      }

      this.$menu
        .on("click", $.proxy(this.click, this))
        .on("mouseenter", "li", $.proxy(this.mouseenter, this))
        .on("mouseleave", "li", $.proxy(this.mouseleave, this));
    },

    eventSupported(eventName) {
      let isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, "return;");
        isSupported = typeof this.$element[eventName] === "function";
      }
      return isSupported;
    },

    move(e) {
      if (!this.shown) return;

      switch (e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          e.preventDefault();
          this.next();
          break;
      }

      e.stopPropagation();
    },

    keydown(e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
      this.move(e);
    },

    keypress(e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup(e) {
      switch (e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
        case 13: // enter
          if (!this.shown) return;
          this.select();
          break;

        case 27: // escape
          if (!this.shown) return;
          this.hide();
          break;

        default:
          this.lookup();
      }

      e.stopPropagation();
      e.preventDefault();
    },

    focus(e) {
      this.focused = true;
    },

    blur(e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click(e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
      this.$element.focus();
    },

    mouseenter(e) {
      this.mousedover = true;
      this.$menu.find(".active").removeClass("active");
      $(e.currentTarget).addClass("active");
    },

    mouseleave(e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    },
  };

  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  const old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("typeahead");
      const options = typeof option === "object" && option;
      if (!data) $this.data("typeahead", (data = new Typeahead(this, options)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>',
    minLength: 1,
  };

  $.fn.typeahead.Constructor = Typeahead;

  /* TYPEAHEAD NO CONFLICT
   * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };

  /* TYPEAHEAD DATA-API
   * ================== */

  $(document).on(
    "focus.typeahead.data-api",
    '[data-provide="typeahead"]',
    function (e) {
      const $this = $(this);
      if ($this.data("typeahead")) return;
      $this.typeahead($this.data());
    }
  );
})(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!(function ($) {
  // jshint ;_;

  /* AFFIX CLASS DEFINITION
   * ====================== */

  const Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options);
    this.$window = $(window)
      .on("scroll.affix.data-api", $.proxy(this.checkPosition, this))
      .on(
        "click.affix.data-api",
        $.proxy(function () {
          setTimeout($.proxy(this.checkPosition, this), 1);
        }, this)
      );
    this.$element = $(element);
    this.checkPosition();
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(":visible")) return;

    const scrollHeight = $(document).height();
    const scrollTop = this.$window.scrollTop();
    const position = this.$element.offset();
    const { offset } = this.options;
    let offsetBottom = offset.bottom;
    let offsetTop = offset.top;
    const reset = "affix affix-top affix-bottom";
    let affix;

    if (typeof offset !== "object") offsetBottom = offsetTop = offset;
    if (typeof offsetTop === "function") offsetTop = offset.top();
    if (typeof offsetBottom === "function") offsetBottom = offset.bottom();

    affix =
      this.unpin != null && scrollTop + this.unpin <= position.top
        ? false
        : offsetBottom != null &&
          position.top + this.$element.height() >= scrollHeight - offsetBottom
        ? "bottom"
        : offsetTop != null && scrollTop <= offsetTop
        ? "top"
        : false;

    if (this.affixed === affix) return;

    this.affixed = affix;
    this.unpin = affix == "bottom" ? position.top - scrollTop : null;

    this.$element
      .removeClass(reset)
      .addClass(`affix${affix ? `-${affix}` : ""}`);
  };

  /* AFFIX PLUGIN DEFINITION
   * ======================= */

  const old = $.fn.affix;

  $.fn.affix = function (option) {
    return this.each(function () {
      const $this = $(this);
      let data = $this.data("affix");
      const options = typeof option === "object" && option;
      if (!data) $this.data("affix", (data = new Affix(this, options)));
      if (typeof option === "string") data[option]();
    });
  };

  $.fn.affix.Constructor = Affix;

  $.fn.affix.defaults = {
    offset: 0,
  };

  /* AFFIX NO CONFLICT
   * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  /* AFFIX DATA-API
   * ============== */

  $(window).on("load", () => {
    $('[data-spy="affix"]').each(function () {
      const $spy = $(this);
      const data = $spy.data();

      data.offset = data.offset || {};

      data.offsetBottom && (data.offset.bottom = data.offsetBottom);
      data.offsetTop && (data.offset.top = data.offsetTop);

      $spy.affix(data);
    });
  });
})(window.jQuery);
