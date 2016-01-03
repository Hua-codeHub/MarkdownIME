var MarkdownIME;(function(MarkdownIME){var Utils;(function(Utils){var Pattern;(function(Pattern){var NodeName;(function(NodeName){NodeName.list=/^(UL|OL)$/;NodeName.li=/^LI$/;NodeName.line=/^(P|DIV|H\d)$/;NodeName.blockquote=/^BLOCKQUOTE$/;NodeName.pre=/^PRE$/;NodeName.hr=/^HR$/})(NodeName=Pattern.NodeName||(Pattern.NodeName={}))})(Pattern=Utils.Pattern||(Utils.Pattern={}));function move_cursor_to_end(ele){var selection=ele.ownerDocument.defaultView.getSelection();var range=ele.ownerDocument.createRange();var focusNode=ele;while(focusNode.nodeType==1){var children=focusNode.childNodes;var t=children[children.length-1];if(!t)break;focusNode=t}range.selectNode(focusNode);range.collapse(focusNode.nodeName=="BR"||/^\n+$/.test(focusNode.textContent));selection.removeAllRanges();selection.addRange(range)}Utils.move_cursor_to_end=move_cursor_to_end;function is_node_empty(node,regardBrAsEmpty){if(regardBrAsEmpty===void 0){regardBrAsEmpty=true}if(!node)return false;return node.nodeType==Node.TEXT_NODE&&/^[\s\r\n]*$/.test(node.nodeValue)||node.nodeType==Node.COMMENT_NODE||regardBrAsEmpty&&node.nodeName=="BR"}Utils.is_node_empty=is_node_empty;function is_node_not_empty(node){return!is_node_empty(node)}Utils.is_node_not_empty=is_node_not_empty;function is_node_block(node){if(!node)return false;if(node.nodeType!=1)return false;return Pattern.NodeName.line.test(node.nodeName)||Pattern.NodeName.li.test(node.nodeName)||Pattern.NodeName.pre.test(node.nodeName)}Utils.is_node_block=is_node_block;function is_line_container_clean(wrapper){var children=get_real_children(wrapper);var ci=children.length;if(ci==1&&children[0].nodeType==1){return is_line_container_clean(children[0])}while(ci--){var node=children[ci];if(node.nodeType==Node.TEXT_NODE)continue;return false}return true}Utils.is_line_container_clean=is_line_container_clean;function is_line_empty(line){if(line.textContent.length!=0)return false;if(line.innerHTML.indexOf("<img ")>=0)return false;return true}Utils.is_line_empty=is_line_empty;function get_or_create_prev_block(node,blockTagName){var rtn=node.previousSibling;if(!rtn||rtn.nodeName!=blockTagName){rtn=node.ownerDocument.createElement(blockTagName);node.parentNode.insertBefore(rtn,node)}return rtn}Utils.get_or_create_prev_block=get_or_create_prev_block;function get_real_children(node){return[].filter.call(node.childNodes,is_node_not_empty)}Utils.get_real_children=get_real_children;function get_line_nodes(anchor,wrapper){var rtn=[];var tmp;tmp=anchor.previousSibling;return rtn}Utils.get_line_nodes=get_line_nodes;function build_parent_list(node,end){var rtn=[];var iter=node;while(true){iter=iter.parentNode;if(!iter)break;rtn.push(iter);if(iter==end)break}return rtn}Utils.build_parent_list=build_parent_list;function text2html(text){return text.replace(/&/g,"&amp;").replace(/  /g,"&nbsp;&nbsp;").replace(/"/g,"&quot;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;")}Utils.text2html=text2html;function trim(str){return str.replace(/^[\t\r\n ]+/,"").replace(/[\t\r\n ]+$/,"").replace(/[\t\r\n ]+/," ")}Utils.trim=trim;function wrap(wrapper,node){node.parentNode.replaceChild(wrapper,node);wrapper.appendChild(node)}Utils.wrap=wrap;function generateElementHTML(nodeName,props,innerHTML){var rtn="<"+nodeName;if(props){for(var attr in props){if(!props.hasOwnProperty(attr))continue;var value=""+props[attr];value=value.replace(/&/g,"&amp;");value=value.replace(/"/g,"&quot;");value=value.replace(/</g,"&lt;");value=value.replace(/\t/g,"&#x9;");value=value.replace(/\r/g,"&#xA;");value=value.replace(/\n/g,"&#xD;");rtn+=" "+attr+'="'+value+'"'}}rtn+=">";if(innerHTML){rtn+=innerHTML+"</"+nodeName+">"}else if(!/^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i.test(nodeName)){rtn+="</"+nodeName+">"}return rtn}Utils.generateElementHTML=generateElementHTML})(Utils=MarkdownIME.Utils||(MarkdownIME.Utils={}))})(MarkdownIME||(MarkdownIME={}));var MarkdownIME;(function(MarkdownIME){var Renderer;(function(Renderer){var InlineRendererRegexpReplacement=function(){function InlineRendererRegexpReplacement(name,regex,replacement){this.name=name;this.regex=regex;this.replacement=replacement}InlineRendererRegexpReplacement.prototype.method=function(text){return text.replace(this.regex,this.replacement)};return InlineRendererRegexpReplacement}();Renderer.InlineRendererRegexpReplacement=InlineRendererRegexpReplacement;var InlineRenderer=function(){function InlineRenderer(){this.replacement=[]}InlineRenderer.prototype.RenderHTML=function(html){var rtn=MarkdownIME.Utils.trim(html);var i,rule;for(i=0;i<this.replacement.length;i++){rule=this.replacement[i];rtn=rule.method(rtn)}return rtn};InlineRenderer.prototype.RenderText=function(text){var rtn=text;var i,rule;for(i=0;i<this.replacement.length;i++){rule=this.replacement[i];rtn=rule.method(rtn)}return rtn};InlineRenderer.prototype.RenderTextNode=function(node){var docfrag=node.ownerDocument.createElement("div");var nodes;var source=node.textContent;docfrag.innerHTML=this.RenderText(source);nodes=[].slice.call(docfrag.childNodes);while(docfrag.lastChild){node.parentNode.insertBefore(docfrag.lastChild,node.nextSibling)}node.parentNode.removeChild(node);return nodes};InlineRenderer.prototype.RenderNode=function(node){if(node.nodeType==Node.TEXT_NODE){return this.RenderTextNode(node)}var textNodes=this.PreproccessTextNodes(node);var textNode;var rtn=[];while(textNode=textNodes.shift()){var r1=this.RenderTextNode(textNode);rtn.push.apply(rtn,r1)}return rtn};InlineRenderer.prototype.PreproccessTextNodes=function(parent){if(!parent||parent.nodeType!=Node.ELEMENT_NODE)return[];var i=parent.childNodes.length-1;var rtn=[];while(i>=0){var child=parent.childNodes[i];var nextSibling=child.nextSibling;switch(child.nodeType){case Node.COMMENT_NODE:if(nextSibling&&nextSibling.nodeType==Node.TEXT_NODE&&child.textContent=="escaping"){nextSibling.textContent="\\"+nextSibling.textContent;parent.removeChild(child)}break;case Node.TEXT_NODE:if(nextSibling&&nextSibling.nodeType==Node.TEXT_NODE){child.textContent+=nextSibling.textContent;parent.removeChild(nextSibling);rtn.pop()}rtn.push(child);break;case Node.ELEMENT_NODE:var recursive_result=this.PreproccessTextNodes(child);rtn.push.apply(rtn,recursive_result);break}i--}return rtn};InlineRenderer.prototype.AddMarkdownRules=function(){this.replacement=InlineRenderer.markdownReplacement.concat(this.replacement);return this};InlineRenderer.prototype.AddRule=function(rule){this.replacement.push(rule)};InlineRenderer.markdownReplacement=[new InlineRendererRegexpReplacement("escaping",/(\\|<!--escaping-->)([\*`\(\)\[\]\~\\])/g,function(a,b,char){return"<!--escaping-->&#"+char.charCodeAt(0)+";"}),new InlineRendererRegexpReplacement("turn &nbsp; into spaces",/&nbsp;/g,String.fromCharCode(160)),new InlineRendererRegexpReplacement('turn &quot; into "s',/&quot;/g,'"'),new InlineRendererRegexpReplacement("strikethrough",/~~([^~]+)~~/g,"<del>$1</del>"),new InlineRendererRegexpReplacement("bold",/\*\*([^\*]+)\*\*/g,"<b>$1</b>"),new InlineRendererRegexpReplacement("italy",/\*([^\*]+)\*/g,"<i>$1</i>"),new InlineRendererRegexpReplacement("code",/`([^`]+)`/g,"<code>$1</code>"),new InlineRendererRegexpReplacement("img with title",/\!\[([^\]]*)\]\(([^\)\s]+)\s+("?)([^\)]+)\3\)/g,function(a,alt,src,b,title){return MarkdownIME.Utils.generateElementHTML("img",{alt:alt,src:src,title:title})}),new InlineRendererRegexpReplacement("img",/\!\[([^\]]*)\]\(([^\)]+)\)/g,function(a,alt,src){return MarkdownIME.Utils.generateElementHTML("img",{alt:alt,src:src})}),new InlineRendererRegexpReplacement("link with title",/\[([^\]]*)\]\(([^\)\s]+)\s+("?)([^\)]+)\3\)/g,function(a,text,href,b,title){return MarkdownIME.Utils.generateElementHTML("a",{href:href,title:title},text)}),new InlineRendererRegexpReplacement("link",/\[([^\]]*)\]\(([^\)]+)\)/g,function(a,text,href){return MarkdownIME.Utils.generateElementHTML("a",{href:href},text)}),new InlineRendererRegexpReplacement("turn escaped chars back",/<!--escaping-->&#(\d+);/g,function(_,charCode){return"<!--escaping-->"+String.fromCharCode(~~charCode)})];return InlineRenderer}();Renderer.InlineRenderer=InlineRenderer})(Renderer=MarkdownIME.Renderer||(MarkdownIME.Renderer={}))})(MarkdownIME||(MarkdownIME={}));var __extends=this&&this.__extends||function(d,b){for(var p in b)if(b.hasOwnProperty(p))d[p]=b[p];function __(){this.constructor=d}d.prototype=b===null?Object.create(b):(__.prototype=b.prototype,new __)};var MarkdownIME;(function(MarkdownIME){var Renderer;(function(Renderer){var BlockRendererContainer=function(){function BlockRendererContainer(){this.childNodeName=null;this.parentNodeName=null;this.isTypable=true;this.removeFeatureMark=true}BlockRendererContainer.prototype.Elevate=function(node){if(!this.prepareElevate(node))return null;var child;var parent;if(!this.childNodeName){child=node}else{child=node.ownerDocument.createElement(this.childNodeName);while(node.firstChild){child.appendChild(node.firstChild)}node.parentNode.insertBefore(child,node);node.parentElement.removeChild(node)}if(!this.parentNodeName){parent=null}else{if(child.previousElementSibling&&child.previousElementSibling.nodeName==this.parentNodeName){parent=child.previousElementSibling;parent.appendChild(child)}else{parent=child.ownerDocument.createElement(this.parentNodeName);MarkdownIME.Utils.wrap(parent,child)}}return{child:child,parent:parent}};BlockRendererContainer.prototype.prepareElevate=function(node){if(!node)return null;var matchResult=this.featureMark.exec(node.textContent);if(!matchResult)return null;if(this.removeFeatureMark){var n=node;n.innerHTML=n.innerHTML.replace(/&nbsp;/g,String.fromCharCode(160)).replace(this.featureMark,"")}return matchResult};return BlockRendererContainer}();Renderer.BlockRendererContainer=BlockRendererContainer;var BlockRendererContainers;(function(BlockRendererContainers){var UL=function(_super){__extends(UL,_super);function UL(){_super.call(this);this.name="unordered list";this.featureMark=/^\s*[\*\+\-]\s+/;this.childNodeName="LI";this.parentNodeName="UL"}return UL}(BlockRendererContainer);BlockRendererContainers.UL=UL;var OL=function(_super){__extends(OL,_super);function OL(){_super.call(this);this.name="ordered list";this.featureMark=/^\s*\d+\.\s+/;this.childNodeName="LI";this.parentNodeName="OL"}return OL}(BlockRendererContainer);BlockRendererContainers.OL=OL;var BLOCKQUOTE=function(_super){__extends(BLOCKQUOTE,_super);function BLOCKQUOTE(){_super.call(this);this.name="blockquote";this.featureMark=/^(\>|&gt;)\s*/;this.parentNodeName="BLOCKQUOTE"}return BLOCKQUOTE}(BlockRendererContainer);BlockRendererContainers.BLOCKQUOTE=BLOCKQUOTE;var HR=function(_super){__extends(HR,_super);function HR(){_super.call(this);this.isTypable=false;this.name="hr";this.featureMark=/^\s*([\-\=\*])(\s*\1){2,}\s*$/}HR.prototype.Elevate=function(node){if(!this.prepareElevate(node))return null;var child=node.ownerDocument.createElement("hr");node.parentElement.insertBefore(child,node);node.parentElement.removeChild(node);return{parent:null,child:child}};return HR}(BlockRendererContainer);BlockRendererContainers.HR=HR;var HeaderText=function(_super){__extends(HeaderText,_super);function HeaderText(){_super.call(this);this.name="header text";this.featureMark=/^(#+)\s+/}HeaderText.prototype.Elevate=function(node){var match=this.prepareElevate(node);if(!match)return null;var child=node.ownerDocument.createElement("H"+match[1].length);while(node.firstChild){child.appendChild(node.firstChild)}node.parentNode.insertBefore(child,node);node.parentElement.removeChild(node);return{parent:null,child:child}};return HeaderText}(BlockRendererContainer);BlockRendererContainers.HeaderText=HeaderText})(BlockRendererContainers=Renderer.BlockRendererContainers||(Renderer.BlockRendererContainers={}));var BlockRenderer=function(){function BlockRenderer(){this.containers=[]}BlockRenderer.prototype.Elevate=function(node){for(var i=0;i<this.containers.length;i++){var container=this.containers[i];var rtn=container.Elevate(node);if(rtn){rtn.containerType=container;return rtn}}return null};BlockRenderer.prototype.GetSuggestedNodeName=function(container){for(var i=0;i<this.containers.length;i++){var cc=this.containers[i];if(cc.parentNodeName==container.nodeName)return cc.childNodeName}return null};BlockRenderer.prototype.AddMarkdownRules=function(){this.containers=BlockRenderer.markdownContainers.concat(this.containers);return this};BlockRenderer.markdownContainers=[new BlockRendererContainers.BLOCKQUOTE,new BlockRendererContainers.HeaderText,new BlockRendererContainers.HR,new BlockRendererContainers.OL,new BlockRendererContainers.UL];return BlockRenderer}();Renderer.BlockRenderer=BlockRenderer})(Renderer=MarkdownIME.Renderer||(MarkdownIME.Renderer={}))})(MarkdownIME||(MarkdownIME={}));var MarkdownIME;(function(MarkdownIME){var Addon;(function(Addon){var EmojiAddon=function(){function EmojiAddon(){this.name="Emoji";this.use_shortcuts=true;this.use_twemoji=true;this.twemoji_config={};this.full_syntax=/:(\w+):/g;this.chars={smile:"😄",smiley:"😃",grinning:"😀",blush:"😊",wink:"😉",heart_eyes:"😍",kissing_heart:"😘",kissing_closed_eyes:"😚",kissing:"😗",kissing_smiling_eyes:"😙",stuck_out_tongue_winking_eye:"😜",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",flushed:"😳",grin:"😁",pensive:"😔",relieved:"😌",unamused:"😒",disappointed:"😞",persevere:"😣",cry:"😢",joy:"😂",sob:"😭",sleepy:"😪",disappointed_relieved:"😥",cold_sweat:"😰",sweat_smile:"😅",sweat:"😓",weary:"😩",tired_face:"😫",fearful:"😨",scream:"😱",angry:"😠",rage:"😡",confounded:"😖",laughing:"😆",satisfied:"😆",yum:"😋",mask:"😷",sunglasses:"😎",sleeping:"😴",dizzy_face:"😵",astonished:"😲",worried:"😟",frowning:"😦",anguished:"😧",smiling_imp:"😈",open_mouth:"😮",neutral_face:"😐",confused:"😕",hushed:"😯",no_mouth:"😶",innocent:"😇",smirk:"😏",expressionless:"😑",smiley_cat:"😺",smile_cat:"😸",heart_eyes_cat:"😻",kissing_cat:"😽",smirk_cat:"😼",scream_cat:"🙀",crying_cat_face:"😿",joy_cat:"😹",pouting_cat:"😾",sparkles:"✨",fist:"✊",hand:"✋",raised_hand:"✋",cat:"🐱",mouse:"🐭",cow:"🐮",monkey_face:"🐵",star:"⭐",zap:"⚡",umbrella:"☔",hourglass:"⌛",watch:"⌚",black_joker:"🃏",mahjong:"🀄",coffee:"☕",anchor:"⚓",wheelchair:"♿",negative_squared_cross_mark:"❎",white_check_mark:"✅",loop:"➿",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",x:"❌",exclamation:"❗",heavy_exclamation_mark:"❗",question:"❓",grey_exclamation:"❕",grey_question:"❔",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",curly_loop:"➰",black_medium_small_square:"◾",white_medium_small_square:"◽",black_circle:"⚫",white_circle:"⚪",white_large_square:"⬜",black_large_square:"⬛"};this.shortcuts={mad:[">:(",">:-("],blush:[':")',':-")'],broken_heart:["</3","<\\3"],confused:[":/",":-/"],cry:[":'(",":'-(",":,(",":,-("],frowning:[":(",":-("],heart:["<3"],imp:["]:(","]:-("],innocent:["o:)","O:)","o:-)","O:-)","0:)","0:-)"],joy:[":')",":'-)",":,)",":,-)",":'D",":'-D",":,D",":,-D"],kissing:[":*",":-*"],laughing:["x-)","X-)"],neutral_face:[":|",":-|"],open_mouth:[":o",":-o",":O",":-O"],rage:[":@",":-@"],smile:[":D",":-D"],smiley:[":)",":-)"],smiling_imp:["]:)","]:-)"],sob:[":,'(",":,'-(",";(",";-("],stuck_out_tongue:[":P",":-P"],sunglasses:["8-)","B-)"],sweat:[",:(",",:-("],sweat_smile:[",:)",",:-)"],unamused:[":s",":-S",":z",":-Z",":$",":-$"],wink:[";)",";-)"]}}EmojiAddon.prototype.method=function(text){text=text.replace(this.full_syntax,this.magic1.bind(this));if(this.use_shortcuts){for(var name_1 in this.shortcuts){text=this.magic2(text,name_1)}}if(this.use_twemoji&&typeof twemoji!="undefined"){text=twemoji.parse(text,this.twemoji_config)}return text};EmojiAddon.prototype.magic1=function(fulltext,name){return this.chars[name]||fulltext};EmojiAddon.prototype.magic2=function(text,name){var t=this.shortcuts[name];var c=this.chars[name];if(!t||!c)return text;for(var i=t.length-1;i>=0;i--){if(!(t[i]instanceof RegExp)){t[i]=new RegExp(t[i].replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),"g")}text=text.replace(t[i],c)}return text};return EmojiAddon}();Addon.EmojiAddon=EmojiAddon})(Addon=MarkdownIME.Addon||(MarkdownIME.Addon={}))})(MarkdownIME||(MarkdownIME={}));var MarkdownIME;(function(MarkdownIME){var Renderer;(function(Renderer){var Pattern;(function(Pattern){Pattern.codeblock=/^```\s*(\S*)\s*$/g})(Pattern||(Pattern={}));Renderer.inlineRenderer=new Renderer.InlineRenderer;Renderer.blockRenderer=new Renderer.BlockRenderer;Renderer.inlineRenderer.AddMarkdownRules();Renderer.inlineRenderer.AddRule(new MarkdownIME.Addon.EmojiAddon);Renderer.blockRenderer.AddMarkdownRules();function Render(node){var html=MarkdownIME.Utils.trim(node.innerHTML);var match_result;var new_node;var big_block;match_result=Pattern.codeblock.exec(html);if(match_result){big_block=node.ownerDocument.createElement("pre");if(match_result[1].length){var typ=node.ownerDocument.createAttribute("lang");typ.value=match_result[1];big_block.attributes.setNamedItem(typ)}big_block.innerHTML='<br data-mdime-bogus="true">';node.parentNode.replaceChild(big_block,node);return big_block}var elevateResult=Renderer.blockRenderer.Elevate(node);if(elevateResult){if(!elevateResult.containerType.isTypable)return elevateResult.child;node=elevateResult.child}Renderer.inlineRenderer.RenderNode(node);return node}Renderer.Render=Render})(Renderer=MarkdownIME.Renderer||(MarkdownIME.Renderer={}))})(MarkdownIME||(MarkdownIME={}));var MarkdownIME;(function(MarkdownIME){MarkdownIME.config={wrapper:"p",code_block_max_empty_lines:5};var Editor=function(){function Editor(editor){this.editor=editor;this.document=editor.ownerDocument;this.window=editor.ownerDocument.defaultView;this.selection=this.window.getSelection();this.isTinyMCE=/tinymce/i.test(editor.id)}Editor.prototype.Init=function(){if(!this.editor.hasAttribute("contenteditable"))return false;if(this.editor.hasAttribute("mdime-enhanced"))return false;this.editor.addEventListener("keydown",this.keydownHandler.bind(this),false);this.editor.addEventListener("keyup",this.keyupHandler.bind(this),false);this.editor.setAttribute("mdime-enhanced","true");return true};Editor.prototype.ProcessCurrentLine=function(ev){var _dummynode;var tinymce_node;var range=this.selection.getRangeAt(0);if(!range.collapsed)return;var node=range.startContainer;if(node.nodeType==Node.TEXT_NODE&&range.startOffset!=node.textContent.length){_dummynode=node;while(!MarkdownIME.Utils.is_node_block(_dummynode))_dummynode=_dummynode.parentNode;if(MarkdownIME.Utils.Pattern.NodeName.pre.test(_dummynode.nodeName)){node.parentNode.insertBefore(this.document.createTextNode(node.textContent.substr(range.startOffset)),node.nextSibling);_dummynode=this.document.createElement("br");node.parentNode.insertBefore(_dummynode,node.nextSibling);node.textContent=node.textContent.substr(0,range.startOffset);range.selectNode(_dummynode.nextSibling);range.collapse(true);this.selection.removeAllRanges();this.selection.addRange(range);ev.preventDefault()}return}if(this.isTinyMCE){if(!MarkdownIME.Utils.Pattern.NodeName.pre.test(node.nodeName)&&!(node.childNodes.length==1&&node.firstChild.nodeName=="BR"))return;tinymce_node=node;while(!MarkdownIME.Utils.is_node_block(tinymce_node)){tinymce_node=tinymce_node.parentNode}if(MarkdownIME.Utils.Pattern.NodeName.pre.test(tinymce_node.nodeName)){node=tinymce_node;while(node.lastChild&&MarkdownIME.Utils.is_node_empty(node.lastChild)){node.removeChild(node.lastChild)}node.appendChild(this.document.createElement("br"));node.appendChild(this.document.createElement("br"));tinymce_node=null}else{node=tinymce_node.previousSibling;if(MarkdownIME.Utils.Pattern.NodeName.list.test(node.nodeName)){return}}}if(node==this.editor){node=this.document.createElement(MarkdownIME.config.wrapper||"div");node.innerHTML=this.editor.innerHTML;this.editor.innerHTML="";this.editor.appendChild(node)}while(!MarkdownIME.Utils.is_node_block(node)&&node.parentNode!=this.editor){node=node.parentNode}if(!MarkdownIME.Utils.is_node_block(node)&&node.parentNode==this.editor){_dummynode=this.document.createElement(MarkdownIME.config.wrapper||"div");MarkdownIME.Utils.wrap(_dummynode,node);node=_dummynode}var parent_tree=MarkdownIME.Utils.build_parent_list(node,this.editor);while(!MarkdownIME.Utils.is_node_block(node))node=parent_tree.shift();if(MarkdownIME.Utils.Pattern.NodeName.pre.test(node.nodeName)){var txtnode=range.startContainer;while(txtnode.nodeType!=Node.TEXT_NODE&&txtnode.lastChild)txtnode=txtnode.lastChild;var text=txtnode.textContent;var br=this.document.createElement("br");var space=this.document.createTextNode("\n");if(/^[\n\s]*$/.test(text)){for(var i=1;i<=MarkdownIME.config.code_block_max_empty_lines;i++){var testnode=node.childNodes[node.childNodes.length-i];if(!testnode)break;if(!MarkdownIME.Utils.is_node_empty(testnode))break}if(i>MarkdownIME.config.code_block_max_empty_lines)text="```"}if(text=="```"){node.removeChild(txtnode);while(node.lastChild&&MarkdownIME.Utils.is_node_empty(node.lastChild))node.removeChild(node.lastChild);_dummynode=this.GenerateEmptyLine();node.parentNode.insertBefore(_dummynode,node.nextSibling);MarkdownIME.Utils.move_cursor_to_end(_dummynode)}else{node.insertBefore(br,txtnode.nextSibling);node.insertBefore(space,br.nextSibling);MarkdownIME.Utils.move_cursor_to_end(space)}ev.preventDefault();return}else if(MarkdownIME.Utils.is_line_empty(node)){_dummynode=this.GenerateEmptyLine();if(MarkdownIME.Utils.Pattern.NodeName.list.test(node.parentNode.nodeName)){node.parentNode.removeChild(node);node=parent_tree.shift();if(MarkdownIME.Utils.Pattern.NodeName.list.test(node.parentNode.nodeName)){_dummynode=this.GenerateEmptyLine("li")}}else if(MarkdownIME.Utils.Pattern.NodeName.blockquote.test(node.parentNode.nodeName)){node.parentNode.removeChild(node);node=parent_tree.shift()}else{}node.parentNode.insertBefore(_dummynode,node.nextSibling);MarkdownIME.Utils.move_cursor_to_end(_dummynode);ev.preventDefault()}else{if(node.lastChild.attributes&&(node.lastChild.attributes.getNamedItem("data-mdime-bogus")||node.lastChild.attributes.getNamedItem("data-mce-bogus")))node.removeChild(node.lastChild);node=MarkdownIME.Renderer.Render(node);if(this.CreateNewLine(node)){ev.preventDefault();tinymce_node&&tinymce_node.parentNode.removeChild(tinymce_node)}else{MarkdownIME.Utils.move_cursor_to_end(tinymce_node||node)}}};Editor.prototype.CreateNewLine=function(node){var _dummynode;if(MarkdownIME.Utils.Pattern.NodeName.line.test(node.nodeName)||MarkdownIME.Utils.Pattern.NodeName.hr.test(node.nodeName)||MarkdownIME.Utils.Pattern.NodeName.li.test(node.nodeName)){var tagName=MarkdownIME.Utils.Pattern.NodeName.li.test(node.nodeName)?"li":null;_dummynode=this.GenerateEmptyLine(tagName);node.parentNode.insertBefore(_dummynode,node.nextSibling);MarkdownIME.Utils.move_cursor_to_end(_dummynode);return true}if(MarkdownIME.Utils.Pattern.NodeName.pre.test(node.nodeName)){MarkdownIME.Utils.move_cursor_to_end(node);return true}return false};Editor.prototype.keydownHandler=function(ev){var range=this.selection.getRangeAt(0);if(!range.collapsed)return;var keyCode=ev.keyCode||ev.which;if(keyCode==13&&!ev.shiftKey&&!ev.ctrlKey){this.ProcessCurrentLine(ev);return}};Editor.prototype.keyupHandler=function(ev){var keyCode=ev.keyCode||ev.which;var range=this.selection.getRangeAt(0);if(!range.collapsed)return;var node=range.startContainer;if(node.nodeType==Node.TEXT_NODE){var text=node.textContent;var text_after=text.substr(range.startOffset+1);var text_before=text.substr(0,range.startOffset);if(text_after.length)return;if(text_before.length<2)return;if(text_before.charAt(text_before.length-2)=="\\")return;if(keyCode==32){var textnode=node;var shall_do_block_rendering=true;while(!MarkdownIME.Utils.is_node_block(node)){if(shall_do_block_rendering&&node!=node.parentNode.firstChild){shall_do_block_rendering=false}node=node.parentNode}if(node!=this.editor&&node.nodeName!="PRE"){var result=shall_do_block_rendering?MarkdownIME.Renderer.blockRenderer.Elevate(node):null;if(result==null){var result_1=MarkdownIME.Renderer.inlineRenderer.RenderNode(textnode);var tail=result_1.pop();MarkdownIME.Utils.move_cursor_to_end(tail)}else if(result.child.nodeName=="HR"){this.CreateNewLine(result.child)}else{if(result.child.textContent.length==0)result.child.innerHTML='<br data-mdime-bogus="true">';MarkdownIME.Utils.move_cursor_to_end(result.child)}}}}};Editor.prototype.GenerateEmptyLine=function(tagName){if(tagName===void 0){tagName=null}var rtn;rtn=this.document.createElement(tagName||MarkdownIME.config.wrapper||"div");rtn.innerHTML='<br data-mdime-bogus="true">';return rtn};return Editor}();MarkdownIME.Editor=Editor})(MarkdownIME||(MarkdownIME={}));var MarkdownIME;(function(MarkdownIME){var UI;(function(UI){var Toast=function(){function Toast(element,timeout){this.disappearing=false;this.timeout=300;this.style="\n		position: absolute; \n		font-size: 10pt; \n		color: #363; \n		border: 1px solid #363; \n		background: #CFC; \n		padding: 2pt 5pt; \n		border-radius: 0 0 5pt 0; \n		z-index: 32760; \n		transition: .3s ease; \n		opacity: 0; \n		";this.element=element;this.timeout=timeout}Toast.prototype.show=function(){requestAnimationFrame(function(){var dismiss=this.dismiss.bind(this);this.element.style.opacity="1";this.element.addEventListener("mousemove",dismiss,false);if(this.timeout)setTimeout(dismiss,this.timeout)}.bind(this))};Toast.prototype.dismiss=function(){if(this.disappearing)return;this.disappearing=true;this.element.style.opacity="0";setTimeout(function(){this.element.parentNode.removeChild(this.element)}.bind(this),300)};Toast.makeToast=function(text,coveron,timeout){if(timeout===void 0){timeout=0}var document=coveron.ownerDocument||coveron["createElement"]&&coveron||document;var container=coveron.parentNode||coveron["createElement"]&&coveron["body"];var toast_div=document.createElement("div");var toast=new Toast(toast_div,timeout);toast_div.setAttribute("style",toast.style);toast_div.textContent=text;toast_div.style.left=(coveron.offsetLeft||0)+"px";toast_div.style.top=(coveron.offsetTop||0)+"px";container.appendChild(toast_div);return toast};Toast.SHORT=800;Toast.LONG=2e3;return Toast}();UI.Toast=Toast})(UI=MarkdownIME.UI||(MarkdownIME.UI={}))})(MarkdownIME||(MarkdownIME={}));/*!@preserve
    [MarkdownIME](https://github.com/laobubu/MarkdownIME)
    
    Copyright 2016 laobubu

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var MarkdownIME;(function(MarkdownIME){function Scan(window){var document=window.document;var editors;editors=[].slice.call(document.querySelectorAll("[contenteditable]"));[].forEach.call(document.querySelectorAll("iframe"),function(i){var result=Scan(i.contentWindow);if(result.length)editors=editors.concat(result)});return editors}MarkdownIME.Scan=Scan;function Enhance(editor){if(typeof editor["length"]==="number"){return[].map.call(editor,Enhance)}var rtn;rtn=new MarkdownIME.Editor(editor);if(rtn.Init())return rtn;return null}MarkdownIME.Enhance=Enhance;function Bookmarklet(window){[].forEach.call(Enhance(Scan(window)),function(editor){MarkdownIME.UI.Toast.makeToast("MarkdownIME Activated",editor.editor,MarkdownIME.UI.Toast.SHORT).show()})}MarkdownIME.Bookmarklet=Bookmarklet;MarkdownIME.bookmarklet=Bookmarklet;MarkdownIME.enhance=function(window,element){Enhance(element)};MarkdownIME.prepare=MarkdownIME.enhance;MarkdownIME.scan=function(window){Enhance(Scan(window))}})(MarkdownIME||(MarkdownIME={}));