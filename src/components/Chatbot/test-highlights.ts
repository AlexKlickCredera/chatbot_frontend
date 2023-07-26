let highlight = `{"id": "13459169361278072", "content": {"text": "javaScript is one of the most popular languages for writing web and mobile applications today. Thelanguage facilitates fast prototyping of ideas via dynamic typing."}, "position": {"boundingRect": {"x1": 76.02102873060439, "y1": 621.3501485188802, "x2": 732.7056554472496, "y2": 664.2223103841146,"width":809,"height":1200}, "rects": [{"x1": 76.02102873060439, "y1": 621.3501485188802, "x2": 732.7056554472496, "y2": 644.2973327636719,"width":809,"height":1200}, {"x1": 76.28570223050843, "y1": 641.275126139323, "x2": 510.7754938573013, "y2": 664.2223103841146,"width":809,"height":1200}], "pageNumber": 1}, "comment": {"text": "", "emoji": "🔥"}}`;
highlight = JSON.parse(highlight);
console.log(highlight);
console.log(window.innerHeight);
export const testHighlights = {
  "https://arxiv.org/pdf/1708.08021.pdf": [
    {
      content: {
        text: " Type Checking for JavaScript",
      },
      position: {
        boundingRect: {
          x1: 255.73419189453125,
          y1: 139.140625,
          x2: 574.372314453125,
          y2: 165.140625,
          width: 809,
          height: 1200,
        },
        rects: [
          {
            x1: 255.73419189453125,
            y1: 139.140625,
            x2: 574.372314453125,
            y2: 165.140625,
            width: 809.9999999999999,
            height: 1200,
          },
        ],
        pageNumber: 1,
      },
      comment: {
        text: "Flow or TypeScript?",
        emoji: "🔥",
      },
      id: "8245652131754351",
    },
    highlight,
  ],
};
