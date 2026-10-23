// Runs inline before first paint (see app/[locale]/page.tsx): decides whether the
// visitor starts in the list view, so phones and reduced-motion visitors never see
// the lab's loader flash (?3d forces the lab, ?list the list). LabApp makes the
// same call on mount, for client-side navigations where this script doesn't run.
export const BOOT_SCRIPT = `(function(){try{
var q=location.search,list=!/[?&]3d\\b/.test(q)&&(/[?&]list\\b/.test(q)
||matchMedia('(prefers-reduced-motion: reduce)').matches
||matchMedia('(max-width: 760px) and (orientation: portrait)').matches);
document.documentElement.classList.toggle('gate-list',list);
}catch(e){}})();`;

// Without JavaScript the lab never starts; show the list view instead.
export const NOSCRIPT_CSS =
  ".gate #list[hidden]{display:block!important}" +
  ".gate #c,.gate #vignette,.gate #dim,.gate .chrome,.gate #loader,.gate #intro{display:none!important}" +
  "html body{overflow:auto!important;height:auto!important}";
