(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5728:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return s(5796)}])},5796:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return p}});var r=s(5893),i=s(4358),n=s(1138),l=s(484);function c(){var e=(0,n.Z)().switchToAdminView;return(0,r.jsx)("div",{className:"flex justify-center my-12 text-center","data-cy":"home-common",children:(0,r.jsxs)("div",{className:"bg-white border border-gray-200 p-6 w-[32rem] rounded-md inline-flex flex-col justify-center",children:[(0,r.jsx)("img",{src:"/images/kitty-items-logo.svg",alt:"Kitty Items",width:"100",className:"mx-auto mt-6 mb-4"}),(0,r.jsx)("h1",{className:"text-3xl font-semibold",children:"Welcome to Kitty Items!"}),(0,r.jsx)("h3",{className:"text-xl font-semibold mb-6",children:"A CryptoKitties Sample App"}),(0,r.jsxs)("div",{className:"bg-white border border-gray-200 p-6 rounded-md inline-flex flex-col justify-center",children:[(0,r.jsx)("b",{children:"Your marketplace is currently empty."}),(0,r.jsx)("p",{className:"text-gray-light mb-5 mt-1",children:"Get started by minting your first kitty item!"}),(0,r.jsx)(l.C,{onClick:e,children:"MINT YOUR FIRST KITTY ITEM"}),(0,r.jsx)("hr",{className:"mt-8 mb-6"}),(0,r.jsx)("b",{children:"Learn more about Kitty Items"}),(0,r.jsx)("p",{className:"text-gray-light mb-5 mt-1 max-w-xs mx-auto",children:"Learn more about the key components and services that make Kitty Items possible."}),(0,r.jsx)(l.Z,{href:i.Hb.githubRepo,target:"_blank",color:"outline",children:"VIEW DOCUMENTATION & RESOURCES"})]})]})})}s(1664);var a=s(5697),o=s.n(a),d=(s(8204),s(9656)),m=s(9872);o().arrayOf(m.d).isRequired;var u=s(7294),h=s(2031),x=s(7563),f=function(e){var t=e.onClick,s=e.disabled,i=e.children;return(0,r.jsx)("button",{onClick:t,disabled:s,className:"rounded-full border border-gray-200 h-14 w-14 flex items-center justify-center bg-white hover:opacity-80 disabled:opacity-50 disabled:cursor-default",children:i})};function g(e){var t=e.items,s=(0,u.useRef)(),i=(0,u.useState)(!1),n=i[0],l=i[1],c=(0,u.useState)(0),a=c[0],o=c[1],m=(0,u.useState)(0),g=m[0],v=m[1],j=function(e){return e.filter((function(e){return e.owner===d.Z.flowAddress}))}(t).slice(0,10).sort((function(e,t){return t.itemID-e.itemID})),p=(0,u.useMemo)((function(){return Math.ceil(g/432)}),[g]),b=(0,x.Z)((function(e){return v(e.target.scrollLeft)}),200),w=(0,x.Z)((function(){var e;return o((null===(e=s.current)||void 0===e?void 0:e.offsetWidth)||0)}),200);if((0,u.useLayoutEffect)((function(){w()}),[w]),(0,u.useLayoutEffect)((function(){l(!!s.current&&g+a>=s.current.scrollWidth)}),[a,g]),(0,u.useLayoutEffect)((function(){return window.addEventListener("resize",w),function(){window.removeEventListener("resize",w)}}),[w]),0===j.length)return null;var y=function(e){var t;return null===(t=s.current)||void 0===t?void 0:t.scrollTo({top:0,left:432*e,behavior:"smooth"})};return(0,r.jsxs)("div",{"data-cy":"home-common",children:[(0,r.jsxs)("div",{className:"main-container flex pt-10 flex-col sm:flex-row",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{className:"text-4xl text-gray-darkest mb-1",children:"Marketplace Feed"}),(0,r.jsx)("div",{className:"text-xl text-gray-light",children:"Check out the collection."})]}),j.length>2&&(0,r.jsxs)("div",{className:"flex mt-6 sm:mt-0 sm:ml-auto",children:[(0,r.jsx)("div",{className:"mr-5",children:(0,r.jsx)(f,{onClick:function(){return y(p-1)},disabled:0===g,children:(0,r.jsx)("img",{src:"/images/arrow-left.svg",alt:"Previous Page",width:"16",height:"16"})})}),(0,r.jsx)(f,{onClick:function(){return y(p+1)},disabled:n,children:(0,r.jsx)("img",{src:"/images/arrow-right.svg",alt:"Next Page",width:"16",height:"16"})})]})]}),(0,r.jsx)("div",{className:"mt-8 mb-10 2xl:latest-store-list-items",children:(0,r.jsx)("div",{className:"overflow-x-auto pb-5",onScroll:b,ref:s,children:(0,r.jsx)("div",{className:"whitespace-nowrap flex -ml-3 lg:pr-3",children:j.map((function(e){return(0,r.jsx)("div",{className:"flex justify-center px-4",style:{minWidth:432},children:(0,r.jsx)(h.Z,{item:e,size:"sm",isStoreItem:!0})},e.itemID)}))})})}),(0,r.jsx)("div",{className:"border-t border-gray-200"})]})}g.propTypes={items:o().arrayOf(m.d)},f.propTypes={onClick:o().func.isRequired,disabled:o().bool,children:o().node.isRequired};var v=s(5143),j=s(3786);function p(){var e,t,s=(0,j.Z)(),i=s.listings,l=s.isLoading,a=(0,n.Z)(),o=a.currentUser,d=(a.setFlashMessage,a.switchToAdminView,o?o.addr:null),m=(t=i,(e=d)?t&&e[2]%2>0?t.slice(4,10):t&&e[2]%2==0?t.slice(1,4):t:t);return(0,r.jsxs)("div",{children:[(0,r.jsx)(v.Z,{children:"Store"}),(0,r.jsx)("main",{children:!l&&(m&&m.length>0?(0,r.jsx)("div",{children:(0,r.jsx)(g,{items:m})}):(0,r.jsx)(c,{}))})]})}},1580:function(e,t,s){"use strict";s.d(t,{Z:function(){return i}});var r=s(5893);function i(){return(0,r.jsx)("div",{className:"text-center text-lg my-20 text-gray-light",children:"0 Kitty Items"})}},2031:function(e,t,s){"use strict";s.d(t,{Z:function(){return f}});var r=s(5893),i=s(1664),n=s.n(i),l=s(5697),c=s.n(l),a=s(4358),o=s(9872),d=s(1138),m=s(3802),u=s(6681),h=s(9018),x=s(4571);function f(e){var t=e.item,s=e.showOwnerInfo,i=e.size,l=void 0===i?"sm":i,c=e.isStoreItem,o=(0,d.Z)().currentUser,f=o&&t.owner===(null===o||void 0===o?void 0:o.addr),g=Number.isInteger(t.listingResourceID),v=!f&&g,j=a.Hb.profileItem(t.owner,t.itemID),p=(0,m.H)(t.rarity);return(0,r.jsxs)("div",{className:"w-full",children:[(0,r.jsx)(n(),{href:j,passHref:!0,children:(0,r.jsx)("a",{className:"w-full",children:(0,r.jsxs)(u.Z,{name:t.name,rarity:t.rarity,cid:t.image,address:t.owner,id:t.itemID,size:l,isStoreItem:c,classes:"item-image-container-hover",children:[c&&(0,r.jsx)("div",{className:"absolute top-3 left-3",children:(0,r.jsx)("div",{className:"bg-white py-1 px-4 font-bold text-sm rounded-full uppercase ".concat(p),children:"New"})}),v&&(0,r.jsx)("div",{className:"absolute bottom-7",children:(0,r.jsx)("div",{className:"bg-white ".concat(c?"py-3 px-9 text-lg":"py-2 px-6 text-md"," font-bold rounded-full shadow-md uppercase ").concat(p),children:"Purchase"})})]})})}),(0,r.jsxs)("div",{children:[s&&(0,r.jsx)(x.Z,{address:t.owner}),(0,r.jsxs)("div",{className:"flex justify-between items-center mt-5 gap-4",children:[(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)(n(),{href:j,children:(0,r.jsx)("a",{className:"text-lg font-semibold",children:t.name})}),(0,r.jsx)(n(),{href:j,children:(0,r.jsxs)("a",{className:"text-sm font text-gray-light",children:["#",t.itemID]})})]}),(0,r.jsx)("div",{className:"flex items-center",children:g&&(0,r.jsx)(h.Z,{price:t.price})})]})]})]})}f.propTypes={item:o.d,showOwnerInfo:c().bool,size:c().string,isStoreItem:c().bool}},8204:function(e,t,s){"use strict";s.d(t,{Z:function(){return h},r:function(){return m}});var r=s(5893),i=s(5697),n=s.n(i),l=s(9872),c=s(1599),a=s(2031);function o(e){var t=e.address,s=e.itemID,i=e.showOwnerInfo,n=(0,c.ZP)(t,s),l=n.item;return n.isLoading||!l?null:(0,r.jsx)(a.Z,{item:l,showOwnerInfo:i})}o.propTypes={address:n().string.isRequired,itemID:n().number.isRequired,showOwnerInfo:n().bool};var d=s(1580),m="grid gap-y-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-5 minh-50",u={minHeight:520};function h(e){var t=e.items,s=void 0===t?[]:t,i=e.accountItemIds,n=void 0===i?[]:i;return 0===s.length&&0===n.length?(0,r.jsx)(d.Z,{}):(0,r.jsxs)("div",{className:m,style:u,children:[s.map((function(e){return(0,r.jsx)(a.Z,{item:e,showOwnerInfo:!0},"".concat(e.itemID,"-").concat(e.listingResourceID))})),n.map((function(e){return(0,r.jsx)(o,{itemID:e.itemID,address:e.owner,showOwnerInfo:!0},e.itemID)}))]})}h.propTypes={items:n().arrayOf(l.d),accountItemIds:n().array}}},function(e){e.O(0,[572,774,888,179],(function(){return t=5728,e(e.s=t);var t}));var t=e.O();_N_E=t}]);
//# sourceMappingURL=index-224f6edaa415b4d8.js.map