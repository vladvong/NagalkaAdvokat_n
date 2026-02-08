import Script from "next/script";

export default function BinotelWidget() {
  return (
    <>
      <div id="binotelGetCall" />
      <Script
        src="https://widgets.binotel.com/getcall/widgets/0g6n8j4sex72h4vne9ju.js"
        strategy="afterInteractive"
      />
    </>
  );
}
