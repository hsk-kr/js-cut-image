const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Constants
export const CUT_DIRECTION_TOP = 0;
export const CUT_DIRECTION_BOTTOM = 1;
export const CUT_DIRECTION_LEFT = 2;
export const CUT_DIRECTION_RIGHT = 3;
export const CUT_FIND_FIRST_LINE_OVER = 0;
export const CUT_FIND_FIRST_LINE_UNDER = 1;
export const CUT_FIND_LAST_LINE_OVER = 2;
export const CUT_FIND_LAST_LINE_UNDER = 3;

/**
 * Returns [x, y, w, h] if it doesn't find returns null.
 */
function findSpecificLine(
  pixelData,
  width,
  height,
  color,
  deviation,
  perCriterian,
  cutDirection,
  cutType
) {
  const data = pixelData;

  const checkCriterian = (cutType, per, perCriterian) =>
    (cutType === CUT_FIND_FIRST_LINE_OVER && per > perCriterian) ||
    (cutType === CUT_FIND_FIRST_LINE_UNDER && per < perCriterian) ||
    (cutType === CUT_FIND_LAST_LINE_OVER && per > perCriterian) ||
    (cutType === CUT_FIND_LAST_LINE_UNDER && per < perCriterian);

  const checkColor = (deviation, rDeviation, gDeviation, bDeviation) =>
    -deviation <= rDeviation &&
    deviation >= rDeviation &&
    -deviation <= gDeviation &&
    deviation >= gDeviation &&
    -deviation <= bDeviation &&
    deviation >= bDeviation;

  const getRGBDeviationsFromData = (color, data, x, y) => {
    const pos = x * 4 + y * 4 * width;
    return [
      color[0] - data[pos],
      color[1] - data[pos + 1],
      color[2] - data[pos + 2],
    ];
  };

  switch (cutDirection) {
    case CUT_DIRECTION_TOP:
      for (let y = 0; y < height; y++) {
        let cnt = 0;

        for (let x = 0; x < width; x++) {
          const [rDeviation, gDeviation, bDeviation] = getRGBDeviationsFromData(
            color,
            data,
            x,
            y
          );

          if (checkColor(deviation, rDeviation, gDeviation, bDeviation)) {
            cnt++;
          }
        }

        const per = (cnt / width) * 100;
        if (checkCriterian(cutType, per, perCriterian)) {
          return [0, y, width, height - y];
        }
      }
      break;
    case CUT_DIRECTION_BOTTOM:
      for (let y = height - 1; y >= 0; y--) {
        let cnt = 0;

        for (let x = 0; x < width; x++) {
          const [rDeviation, gDeviation, bDeviation] = getRGBDeviationsFromData(
            color,
            data,
            x,
            y
          );

          if (checkColor(deviation, rDeviation, gDeviation, bDeviation)) {
            cnt++;
          }
        }

        const per = (cnt / width) * 100;
        if (checkCriterian(cutType, per, perCriterian)) {
          return [0, 0, width, y];
        }
      }
      break;
    case CUT_DIRECTION_LEFT:
      for (let x = 0; x < width; x++) {
        let cnt = 0;

        for (let y = 0; y < height; y++) {
          const [rDeviation, gDeviation, bDeviation] = getRGBDeviationsFromData(
            color,
            data,
            x,
            y
          );

          if (checkColor(deviation, rDeviation, gDeviation, bDeviation)) {
            cnt++;
          }
        }

        const per = (cnt / height) * 100;
        if (checkCriterian(cutType, per, perCriterian)) {
          return [x, 0, width - x, height];
        }
      }
      break;
    case CUT_DIRECTION_RIGHT:
      for (let x = width - 1; x >= 0; x--) {
        let cnt = 0;

        for (let y = 0; y < height; y++) {
          const [rDeviation, gDeviation, bDeviation] = getRGBDeviationsFromData(
            color,
            data,
            x,
            y
          );

          if (checkColor(deviation, rDeviation, gDeviation, bDeviation)) {
            cnt++;
          }
        }

        const per = (cnt / height) * 100;
        if (checkCriterian(cutType, per, perCriterian)) {
          return [0, 0, x, height];
        }
      }
      break;
  }

  return null;
}

/**
 * Returns a cutted image url if there are errors, returns null
 * @param {string} imgUrl target image url
 * @param {Array} color [R, G, B]
 * @param {number} deviation Deviation of color values.
 * @param {number} perCriterian How much it includes color or not. It depends on cut type
 * @param {number} cutDirection Cut Direction. You must use constants we provide. (CUT_DIRECTION_TOP, CUT_DIRECTION_BOTTOM, CUT_DIRECTION_LEFT, CUT_DIRECTION_RIGHT)
 * @param {number} cutType Whether to cut when a particular line is found or not. (CUT_FIND_FIRST_LINE_OVER, CUT_FIND_FIRST_LINE_UNDER, CUT_FIND_LAST_LINE_OVER, CUT_FIND_LAST_LINE_UNDER)
 */
export async function cutImageByColorLine(
  imgUrl,
  color,
  deviation,
  perCriterian,
  cutDirection,
  cutType
) {
  return new Promise((resolve, reject) => {
    const imgElmt = new Image();

    imgElmt.src = imgUrl;
    imgElmt.onload = () => {
      const { width, height } = imgElmt;

      canvas.width = width;
      canvas.height = height;
      context.drawImage(imgElmt, 0, 0);
      const { data } = context.getImageData(0, 0, width, height);

      // Cut by direction
      const line = findSpecificLine(
        data,
        width,
        height,
        color,
        deviation,
        perCriterian,
        cutDirection,
        cutType
      );

      if (line !== null) {
        const [cutX, cutY, cutW, cutH] = line;

        canvas.width = cutW;
        canvas.height = cutH;
        context.drawImage(imgElmt, cutX, cutY, cutW, cutH, 0, 0, cutW, cutH);

        return resolve(canvas.toDataURL());
      }

      return resolve(null);
    };

    imgElmt.onerror = (err) => {
      reject(err);
    };
  });
}

export default {
  cutImageByColorLine,
  CUT_DIRECTION_TOP,
  CUT_DIRECTION_BOTTOM,
  CUT_DIRECTION_LEFT,
  CUT_DIRECTION_RIGHT,
  CUT_FIND_FIRST_LINE_OVER,
  CUT_FIND_FIRST_LINE_UNDER,
  CUT_FIND_LAST_LINE_OVER,
  CUT_FIND_LAST_LINE_UNDER,
};
