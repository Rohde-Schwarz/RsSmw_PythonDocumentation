(function () {
  function commandOf(block) {
    var pre = block.querySelector("pre");
    if (!pre) return "";
    var lines = (pre.textContent || "").split("\n");
    var i, line;
    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();
      if (!line) continue;
      if (line.charAt(0) !== "#" && line.indexOf("//") !== 0) return "";
      return line.replace(/^(?:\/\/|#)\s*(?:SCPI:\s*)?/, "").trim();
    }
    return "";
  }

  function linkLists() {
    var lists = document.querySelectorAll("dl.scpi");
    if (!lists.length) return;
    var blocks = document.querySelectorAll("dl.method, dl.property, dl.attribute, dl.function, dl.csharp");
    var byCommand = {};
    var i, cmd, block;
    for (i = 0; i < blocks.length; i++) {
      block = blocks[i];
      cmd = commandOf(block);
      if (cmd && !byCommand[cmd]) byCommand[cmd] = block;
    }
    var serial = 0;
    for (i = 0; i < lists.length; i++) {
      var items = lists[i].children;
      var j;
      for (j = 0; j < items.length; j++) {
        var dt = items[j];
        if (!dt || dt.tagName !== "DT") continue;
        cmd = (dt.textContent || "").replace(/\s+/g, "");
        block = byCommand[cmd];
        if (!block) continue;
        if (!block.id) {
          serial += 1;
          block.id = "scpi-" + serial;
        }
        var link = document.createElement("a");
        link.className = "scpi-jump";
        link.href = "#" + block.id;
        var node = dt.firstChild;
        while (node && node.nodeType === 3) {
          var next = node.nextSibling;
          link.appendChild(node);
          node = next;
        }
        dt.insertBefore(link, dt.firstChild);
      }
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", linkLists);
  else
    linkLists();
})();
