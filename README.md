# JS Cut Image

A lib for cutting an image by specific color line.

---

## Installing

Using npm:

`npm install js-cut-image`

or using yarn:

`yarn add js-cut-image`

---

## Functions

**cutImageByColorLine(image url, [r, g, b], deviation, percentage criterion, CUT_DIRECTION_TOP | CUT_DIRECTION_BOTTOM | CUT_DIRECTION_LEFT | CUT_DIRECTION_RIGHT, CUT_FIND_FIRST_LINE_OVER | CUT_FIND_FIRST_LINE_UNDER | CUT_FIND_LAST_LINE_OVER | CUT_FIND_LAST_LINE_UNDER)**

cutImageByColorLine(imgUrl, [255, 255, 255], 5, 70, CUT_DIRECTION_TOP, CUT_FIND_FIRST_LINE_OVER);

It means that search from top to bottom and when find a line that includes white color( but It's okay from -5 to +5 from the criterion number) over 70% of a line, remove from first line to the line.

---

## Example

![An apple before cutting](https://github.com/hsk-kr/js-cut-image/blob/master/example/apple.png?raw=true)

Let's say. <br />
We have the image and want to remove black colors of the image.

```javascript
import {
  cutImageByColorLine,
  CUT_DIRECTION_TOP,
  CUT_DIRECTION_BOTTOM,
  CUT_DIRECTION_LEFT,
  CUT_DIRECTION_RIGHT,
  CUT_FIND_FIRST_LINE_OVER,
  CUT_FIND_LAST_LINE_UNDER,
} from 'js-cut-image';

...

let cuttedImgUrl = await cutImageByColorLine(
  imgUrl,
  [0, 0, 0],
  10,
  70,
  CUT_DIRECTION_TOP,
  CUT_FIND_LAST_LINE_UNDER
);
cuttedImgUrl = await cutImageByColorLine(
  cuttedImgUrl,
  [0, 0, 0],
  10,
  70,
  CUT_DIRECTION_LEFT,
  CUT_FIND_LAST_LINE_UNDER
);
cuttedImgUrl = await cutImageByColorLine(
  cuttedImgUrl,
  [0, 0, 0],
  10,
  70,
  CUT_DIRECTION_RIGHT,
  CUT_FIND_LAST_LINE_UNDER
);
cuttedImgUrl = await cutImageByColorLine(
  cuttedImgUrl,
  [0, 0, 0],
  10,
  70,
  CUT_DIRECTION_BOTTOM,
  CUT_FIND_LAST_LINE_UNDER
);
```

After executing the code, The image will be changed like this.

![An apple before cutting](https://github.com/hsk-kr/js-cut-image/blob/master/example/after_apple.png?raw=true)
