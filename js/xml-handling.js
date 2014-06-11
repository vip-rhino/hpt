/**
 * XML Handling
 */

/**
 * const
 */
var _xmlErrMsg = "xmlの取得に失敗したみたい。\r\n再試行してダメなら管理人にご一報お願いします。\r\n詳細な状況を教えてくれると助かります。";
var _clap = "";
var _omit = "omitposition";

/**
 * title
 */
function makeTitle(title) {
    return "<h2><img src=\"img/main-image-t-16.png\" alt=\"\">" + title + "</h2>";
}

/**
 * link
 */
function makeLink(name, anchor) {
    return "<h3><img src=\"img/main-image-t-16.png\" alt=\"\"><a href=\"" + anchor + "\" target=\"_blank\">" + name + "</a></h3>";
}

/**
 * loading-modal
 */
function showLoadingModal() {
    $("div#loading-modal").addClass("loading");
}
function closeLoadingModal() {
    $("div#loading-modal").removeClass("loading");
}

/**
 * index
 */
function getIndex(){
    $.ajax({
        url:"dat/basic/index.xml",
        type:"GET",
        dataType:"xml",
        timeout:2000,
        error:xmlerr,
        success:xmlsuc
    });
    function xmlerr(){ alert(_xmlErrMsg);};
    function xmlsuc(xml){
        $(xml).find("welkom").each(setWelkom);
        $(xml).find("message").each(setWkMessage);
        $(xml).find("update").each(setUpdate);
        closeLoadingModal();
    };
    function setWelkom(){
        $("div#welcome").html($(this).find("image").text() + $(this).find("title").text() + $(this).find("subject").text() + _clap);
    }
    function setWkMessage(){
        var str = makeTitle($(this).find("title").text());
        str += "<hr>"
        str += $(this).find("body").text();
        $("div#wk-message").html(str);
    }
    function setUpdate(){
        var str = makeTitle($(this).find("title").text());
        str += "<hr>";
        str += "<div id=\"news-body\">";
        str += $(this).find("body").text();
        str += "</div>";
        $("div#update").html(str);
    }
}

/**
 * about
 */
function getAbout(){
    $.ajax({
        url:"dat/basic/about.xml",
        type:"GET",
        dataType:"xml",
        timeout:2000,
        error:xmlerr,
        success:xmlsuc
    });
    function xmlerr(){ alert(_xmlErrMsg);};
    function xmlsuc(xml){
        $(xml).find("about").each(setAbout);
        $(xml).find("profile").each(setProfile);
        closeLoadingModal();
    };
    function setAbout(){
        var str = makeTitle($(this).find("title").text());
        str += "<hr>"
        str += $(this).find("body").text();
        $("div#about").html(str);
    }
    function setProfile(){
        var str = makeTitle($(this).find("title").text());
        str += "<hr>"
        str += $(this).find("body").text();
        $("div#profile").html(str);
    }
}

/**
 * text list
 */
function getTextList(fileName){
    var textData = [];
    $.ajax({
        url:"dat/" + fileName + ".xml",
        type:"GET",
        dataType:"xml",
        timeout:2000,
        error:xmlerr,
        success:xmlsuc
    });
    function xmlerr(){ alert(_xmlErrMsg);};
    function xmlsuc(xml){
        $(xml).find("text").each(getTextList);
        setTextList();
        closeLoadingModal();
    };
    function getTextList(){
        var data = {};
        data['no'] = $(this).attr("no");
        data['date'] = $(this).find("date").text();
        data['subject'] = $(this).find("subject").text();
        data['body'] = $(this).find("body").text();
        textData.unshift(data);
    }
    function setTextList(){
        var str = "<div class=\"row-fluid\">";
        var rows = 0;
        textData.forEach(
            function (dat){
                if(rows % 3 === 0) {
                    str += "</div><div class=\"row-fluid\">";
                }
                str += "<div class=\"span4 span\">";
                str += makeTitle(dat["date"]);
                str += "<hr>";
                str += "<h3>" + dat["subject"] + "</h3>";
                str += dat["body"].split(_omit)[0];
                if(dat["body"].indexOf(_omit) > 0) {
                    str += "<a href=\"#\" onclick=\"setHidden(" + fileName + ", " + dat["no"] + ");document.submitForm.submit();return false;\"><p class=\"read-more\">read more...</p></a>";
                }
                str += "</div>";
                rows++;
            }
        );
        str += "</div>";
        $("div#data").html(str);
    }
}

/**
 * text
 */
function getText(){
    var form = new Array();
    var buffer = location.search.substr(1);
    var pairs = buffer.split("&");
    for (var i in pairs) {
        var pair = pairs[i].split("=");
        form[pair[0]] = pair[1];
    }
    $.ajax({
        url:"dat/" + form["ym"] + ".xml",
        type:"GET",
        dataType:"xml",
        timeout:2000,
        error:xmlerr,
        success:xmlsuc
    });
    function xmlerr(){ alert(_xmlErrMsg);};
    function xmlsuc(xml){
        $(xml).find("text").each(setText);
        closeLoadingModal();
    };
    function setText(){
        if($(this).attr("no") === form["no"]){
            $("div#date").html(makeTitle($(this).find("date").text()));
            $("div#subject").html("<h3>" + $(this).find("subject").text() + "</h3>");
            $("div#body").html($(this).find("body").text().replace(new RegExp(_omit, 'g'), ''));
            return false;
        }
    }
}

/**
 * link
 */
function getGalleryList(){
    var textData = [];
    $.ajax({
        url:"dat/basic/gallery.xml",
        type:"GET",
        dataType:"xml",
        timeout:2000,
        error:xmlerr,
        success:xmlsuc
    });
    function xmlerr(){ alert(_xmlErrMsg);};
    function xmlsuc(xml){
        $(xml).find("img").each(getGalleryList);
        setGalleryList();
        closeLoadingModal();
    };
    function getGalleryList(){
        var data = {};
        data["src"] = $(this).find("src").text();
        data["title"] = $(this).find("title").text();
        textData.push(data);
    }
    function setGalleryList(){
        var str = "<ul>";
        textData.forEach(
            function (dat){
                str += "<li><a class=\"images\" href=\"" + dat["src"] + "\" title=\"" + dat["title"] + "\"><img src=\"" + dat["src"] + "\" alt=\"\"></a></li>";
            }
        );
        str += "</ul>";
        $("div#gallery").html(str);
        $(".images").colorbox({rel:'images', slideshow:false});
    }
}

/**
 * link
 */
function getLinkList(){
    var textData = [];
    $.ajax({
        url:"dat/basic/link.xml",
        type:"GET",
        dataType:"xml",
        timeout:2000,
        error:xmlerr,
        success:xmlsuc
    });
    function xmlerr(){ alert(_xmlErrMsg);};
    function xmlsuc(xml){
        $(xml).find("link").each(getLinkList);
        setLinkList();
        closeLoadingModal();
    };
    function getLinkList(){
        var data = {};
        data["subject"] = $(this).find("subject").text();
        data["anchor"] = $(this).find("anchor").text();
        data["body"] = $(this).find("body").text();
        textData.push(data);
    }
    function setLinkList(){
        var str = "<div class=\"row-fluid\">";
        var rows = 0;
        textData.forEach(
            function (dat){
                if(rows % 2 === 0) {
                    str += "</div><div class=\"row-fluid\">";
                }
                str += "<div class=\"span6 span\">";
                str += makeLink(dat["subject"], dat["anchor"]);
                str += "<hr>";
                str += dat["body"];
                str += "</div>";
                rows++;
            }
        );
        str += "</div>";
        $("div#data").html(str);
    }
}


