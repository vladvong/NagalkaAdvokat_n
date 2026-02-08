import Script from "next/script";

export default function BinotelWidget() {
  return (
    <>
      <div id="binotelGetCall"></div>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(d, w, s) {
  var widgetHash = '0g6n8j4sex72h4vne9ju', gcw = d.createElement(s);
  gcw.type = 'text/javascript';
  gcw.async = true;
  gcw.src = '//widgets.binotel.com/getcall/widgets/' + widgetHash + '.js';
  var sn = d.getElementsByTagName(s)[0];
  sn.parentNode.insertBefore(gcw, sn);
})(document, window, 'script');`,
        }}
      />
    </>
  );
}
