// ==UserScript==
// @name         Unipus自动刷新
// @namespace    https://blog.negoces.top/
// @version      0.2
// @description  Unipus自动刷新
// @author       NEGOCES
// @match        http://10.10.25.7/login/hpindex_student.php
// @match        http://10.10.25.7/login/hponlinetime.php
// @grant        none
// ==/UserScript==

console.log("This page will reload in 5 seconds!");
setTimeout("window.location.reload();", "5000");