import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export function translateSmokeStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "禁煙";
    case 1:
      return "喫煙";
    case 2:
      return "喫煙（加熱式たばこ限定）";
    default:
      return "";
  }
}

export function addCommasToNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function translateMessageGroupStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "配信待ち";
    case 1:
      return "下書き";
    case 2:
      return "配信済み";
    default:
      return "";
  }
}

export function getDayOfWeek(day) {
  switch (day) {
    case 0:
      return "日";
    case 1:
      return "月";
    case 2:
      return "火";
    case 3:
      return "水";
    case 4:
      return "木";
    case 5:
      return "金";
    case 6:
      return "土";
  }
}
export function getIdAttrType(val) {
  switch (val) {
    case "文字入力（一行）":
      return "1";
    case "数字入力":
      return "2";
    case "選択項目（１つだけ選択可能）":
      return "3";
    case "選択項目（複数回答可能）":
      return "4";
    case "日付":
      return "5";
    case "文字入力（複数行）":
      return "6";
  }
}

export function getTextAttrTypeId(val) {
  switch (val) {
    case 1:
      return "文字入力（一行）";
    case 2:
      return "数字入力";
    case 3:
      return "選択項目（１つだけ選択可能）";
    case 4:
      return "選択項目（複数回答可能）";
    case 5:
      return "日付";
    case 6:
      return "文字入力（複数行）";
  }
}

export function getFieldChangeOrder(val) {
  switch (val) {
    case "名前":
      return "nameOrder";
    case "名前カナ":
      return "spellingOrder";
    case "携帯番号":
      return "phoneOrder";
    case "メール":
      return "mailOrder";
    case "郵便番号":
      return "postalOrder";
    case "住所１":
      return "address1Order";
    case "住所２":
      return "address1Order";
    case "性別":
      return "genderOrder";
    case "生年月日":
      return "birthdayOrder";
    case "写真":
      return "avatarOrder";
    case "来店回数":
      return "visitBeforeOrder";
    case "ステータス":
      return "statusOrder";
    case "前回来店日":
      return "lastVisitOrder";
    case "お客様メモ":
      return "noteOrder";
  }
}

export function translateStoreStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "営業中"; // IN_BUSINESS
    case 1:
      return "改装中"; // FIXING
    case 2:
      return "休業中"; // OFF_BUSINESS
    case 3:
      return "閉店"; // CLOSE
    default:
      return "";
  }
}

export function translateAllowGroupMessage(val) {
  val = val ? 1 : 0;
  switch (val) {
    case 0:
      return "不可";
    case 1:
      return "可能";
    default:
      return "";
  }
}

export function translateGender(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "女性"; // Moi toi tiem
    case 1:
      return "男性"; // VIP
    case 2:
      return "その他"; // Blacklist
    default:
      return "";
  }
}

export function translateCustomerStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "ご新規"; // Moi toi tiem
    case 1:
      return "VIP"; // VIP
    case 2:
      return "ブラック"; // Blacklist
    default:
      return "";
  }
}

export function translateReservationStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "予約確定"; // xac nhan dat phong
    case 1:
      return "仮予約"; // dat tam thoi
    case 2:
      return "キャンセル待ち"; // cho huy
    default:
      return "";
  }
}

export function translateReservationTrackingStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "来店待ち"; // XANH LA -- Dang cho toi
    case 1:
      return "来店中"; // XANH NHAT -- Dang trong tiem
    case 2:
      return "退店"; // XAM -- da roi khoi
    case 3:
      return "NoShow"; // DEN -- khong toi
    default:
      return "";
  }
}

export function translateHasChangeStatus(val) {
  val = parseInt(val);
  switch (val) {
    case 0:
      return "";
    case 1:
      return "追加"; // them
    case 2:
      return "変更あり"; // thay doi+
    default:
      return "";
  }
}

export function formatDateByTimezone(dateVal, type) {
  if (dateVal === null || dateVal === undefined) return;
  const date = dayjs.utc(dateVal);

  if (type === 1) {
    return dayjs.tz(date, "Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
  }
  if (type === 2) {
    return dayjs.tz(date, "Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss");
  }
  if (type === 3) {
    return dayjs.tz(date, "Asia/Tokyo").format("YYYY-MM-DD[T]HH:mm:ss");
  }
  return date;
}

export function formatDateWithDay(dateVal) {
  if (dateVal === null || dateVal === undefined) return "";
  const date = dayjs(dateVal).tz("Asia/Tokyo").format("YYYY-MM-DD");
  const day = dayjs(date).get("day");
  return `${date} (${getDayOfWeek(day)})`;
}

export function formatTime(dateVal) {
  if (dateVal === null || dateVal === undefined) return "";
  const time = dayjs(dateVal).tz("Asia/Tokyo").format("HH:mm");
  return time;
}

export function getTodayByTimeZone() {
  return dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
}

export function translateDay(dayVal) {
  let day = "";
  switch (dayVal) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
  }
  return day;
}

export function getStatusTypeFromReservation(reservation) {
  if (
    reservation.reservationStatus === 0 &&
    reservation.reservationTrackingStatus === 1
  ) {
    return "visiting";
  }
  if (
    reservation.reservationStatus === 0 &&
    reservation.reservationTrackingStatus === 0
  ) {
    return "waiting-for-visit";
  }
  if (reservation.reservationStatus === 2) {
    return "waiting-list";
  }
  if (reservation.reservationStatus === 1) {
    return "temporary-reservation";
  }
  if (
    reservation.reservationStatus === 0 &&
    reservation.reservationTrackingStatus === 2
  ) {
    return "closed";
  }
  if (
    reservation.reservationStatus === 0 &&
    reservation.reservationTrackingStatus === 3
  ) {
    return "no-show";
  }
  return "";
}

export function translateHolidays(val) {
  val = parseInt(val);
  switch (val) {
    case 1:
      return "月曜";
    case 2:
      return "火曜";
    case 3:
      return "水曜";
    case 4:
      return "木曜";
    case 5:
      return "金曜";
    case 6:
      return "土曜";
    case 0:
      return "日曜";
    case -2:
      return "祝日";
    case -1:
      return "不定";
  }
}

const semverGreaterThan = (versionA, versionB) => {
  // code from above snippet goes here
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());
    // eslint-disable-next-line no-continue
    if (a === b) continue;
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b);
  }
  return false;
};

export function checkVersion() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.NODE_ENV !== "test"
  ) {
    fetch("/meta.json")
      .then((response) => response.json())
      .then((meta) => {
        const latestVersion = meta.version;
        const currentVersion = global.appVersion;
        console.log(latestVersion, currentVersion);
        const shouldForceRefresh = semverGreaterThan(
          latestVersion,
          currentVersion
        );
        if (shouldForceRefresh) {
          console.log(
            `We have a new version - ${latestVersion}. Should force refresh`
          );
          console.log("Clearing cache and hard reloading...");
          if (caches) {
            // Service worker cache should be cleared with caches.delete()
            caches.keys().then(function (names) {
              for (const name of names) caches.delete(name);
            });
          }
          // delete browser cache and hard reload
          window.location.reload();
        } else {
          console.log(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`
          );
        }
      });
  }
}
