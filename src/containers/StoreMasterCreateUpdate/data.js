import { translateStoreStatus } from "utils/common";

export const hourOptions = ["--"];
export const minutesOptions = ["--", "00", "15", "30", "45"];
for (let j = 0; j < 24; j++) {
  j < 10 ? hourOptions.push(`0${j}`) : hourOptions.push(`${j}`);
}

export const weeklyHolidays = [
  { id: 1, name: "月曜" },
  { id: 2, name: "火曜" },
  { id: 3, name: "水曜" },
  { id: 4, name: "木曜" },
  { id: 5, name: "金曜" },
  { id: 6, name: "土曜" },
  { id: 0, name: "日曜" },
  { id: -2, name: "祝日" },
  { id: -1, name: "不定" },
];

export const statusButtons = [
  {
    value: "0",
    label: "営業中",
    buttonProps: {
      className: "button button__default",
    },
  },
  {
    value: "1",
    label: "改装中",
    buttonProps: {
      className: "button button__default",
    },
  },
  {
    value: "2",
    label: "休業中",
    buttonProps: {
      className: "button button__default",
    },
  },
  {
    value: "3",
    label: "閉店",
    buttonProps: {
      className: "button button__default",
    },
  },
];

export const publicStatusButtons = [
  {
    value: "true",
    label: "公開中",
    buttonProps: {
      className: "button button__default",
    },
  },
  {
    value: "false",
    label: "非公開",
    buttonProps: {
      className: "button button__default",
    },
  },
];

export const reservedBeforeHourStartOptions = ["指定なし"];
for (let j = 1; j < 24; j++) {
  reservedBeforeHourStartOptions.push(`${j}時間後`);
}

export const reservedBeforeDayOptions = ["当日"];
export const reservedBeforeDayEndOptions = ["指定なし"];
for (let j = 1; j < 8; j++) {
  reservedBeforeDayEndOptions.push(`${j}日後`);
  reservedBeforeDayOptions.push(`${j}日後`);
}

export const displayCrowdedPercentOptions = [];
for (let j = 1; j < 10; j++) {
  displayCrowdedPercentOptions.push(`${j}割`);
}

export const dataPreview = [
  {
    heading: "店舗情報",
    items: [
      {
        label: "店舗名",
        value: (watcher) => {
          const v = `${watcher.name} `;
          return v || "";
        },
      },
      {
        label: "店舗名（カナ）",
        value: (watcher) => {
          const v = `${watcher.kanaName ? watcher.kanaName : ""} `;
          return v || "";
        },
      },
      {
        label: "メッセージの表示名",
        value: (watcher) => {
          const v = `${watcher.displayName}`;
          return v || "";
        },
      },
      {
        label: "郵便番号",
        value: (watcher) => {
          const v = `${watcher.postalCode}`;
          return v || "";
        },
      },
      {
        label: "所在地",
        value: (watcher) => {
          const v = `${watcher.address}`;
          return v || "";
        },
      },
      {
        label: "電話番号",
        value: (watcher) => {
          const v = watcher.phonenumber ? watcher.phonenumber : "";
          return v || "";
        },
      },
    ],
  },
  {
    heading: "営業情報",
    items: [
      {
        label: "営業時間",
        value: (watcher) => {
          const businessHours = watcher.businessHours
            ? watcher.businessHours
            : [];
          let formattedTime = "";
          businessHours.forEach((time, index) => {
            if (
              time.startTimeHour !== "" &&
              time.startTimeMinute !== "" &&
              time.startTimeHour !== undefined &&
              time.startTimeMinute !== undefined
            ) {
              formattedTime += time.startTimeHour + ":" + time.startTimeMinute;
            }
            if (
              time.endTimeHour !== "" &&
              time.endTimeMinute !== "" &&
              time.endTimeHour !== undefined &&
              time.endTimeMinute !== undefined
            ) {
              formattedTime +=
                "~" + time.endTimeHour + ":" + time.endTimeMinute;
            }
            if (index < businessHours.length - 1) {
              formattedTime += " , ";
            }
          });
          return formattedTime;
        },
      },
      {
        label: "定休日",
        value: (watcher) => {
          const weeklyHolidays = watcher.weeklyHolidays
            ? watcher.weeklyHolidays
            : [];
          let holidays = "";
          weeklyHolidays.forEach((holiday, index) => {
            holidays += holiday.name;
            if (index < weeklyHolidays.length - 1) {
              holidays += ", ";
            }
          });
          return holidays;
        },
      },
      {
        label: "営業状況",
        value: (watcher) => {
          const v = translateStoreStatus(`${watcher.status}`);
          return v || "";
        },
      },
    ],
  },
  {
    heading: "リマインドメッセージ設定",
    items: [
      {
        label: "配信タイミング",
        value: (watcher) => {
          const remindBeforeDate = watcher.remindBeforeDate;
          const remindHour = watcher.remindHour;
          let v = "";
          if (
            remindBeforeDate >= 0 &&
            remindBeforeDate !== "" &&
            remindBeforeDate !== null
          ) {
            v = `予約${remindBeforeDate}日前の`;
          }
          if (remindHour >= 0 && remindHour !== "" && remindHour !== null) {
            v = v + `${remindHour}時に配信`;
          }
          return v || "";
        },
      },
    ],
  },
  {
    heading: "ネット予約設定",
    items: [
      {
        label: "受付期間設定",
        value: (watcher) => {
          const reservedBeforeDay = watcher.netReservation
            ? watcher.netReservation.reservedBeforeDay
            : "0";
          const reservedBeforeHourStart = watcher.netReservation
            ? watcher.netReservation.reservedBeforeHourStart
            : "0";
          const reservedBeforeDayEnd = watcher.netReservation
            ? watcher.netReservation.reservedBeforeDayEnd
            : "0";
          let v = "";
          if (reservedBeforeDay && reservedBeforeDay !== "0") {
            v = `${reservedBeforeDay}日後から`;
          }
          if (reservedBeforeHourStart && reservedBeforeHourStart !== "0") {
            v += `日後${reservedBeforeHourStart}時間後から`;
          }
          if (reservedBeforeDayEnd && reservedBeforeDayEnd !== "0") {
            v += `${reservedBeforeDayEnd}日後まで予約を受付ける`;
          }
          return v;
        },
      },
      {
        label: "空き状況の表示設定",
        value: (watcher) => {
          const v = watcher.netReservation
            ? `空きが${watcher.netReservation.displayCrowdedPercent}割を切った枠を「△」表示する`
            : "";
          return v || "";
        },
      },
      {
        label: "注意書き",
        value: (watcher) => {
          const v = watcher.netReservation
            ? watcher.netReservation.netReservationNote
            : "";
          return v || "";
        },
      },
      {
        label: "予約通知先",
        value: (watcher) => {
          let v = watcher.netReservation
            ? `${watcher.netReservation.staffPhonenumber}, `
            : "";
          v += watcher.netReservation ? watcher.netReservation.staffEmail : "";
          return v || "";
        },
      },
      {
        label: "ネット予約フォームURL",
        value: (watcher) => {
          const v = watcher.formReservationStores
            ? watcher.formReservationStores
            : "店舗情報登録後に表示されます。";
          return v || "";
        },
      },
      {
        label: "公開ステータス",
        value: (watcher) => {
          const v =
            watcher.displayNetReservation &&
            watcher.displayNetReservation === "true"
              ? "公開中"
              : "非公開";
          return v || "";
        },
      },
    ],
  },
  {
    heading: "グルメサイト連携情報",
    items: [
      {
        label: "食べログ",
        value: (watcher) => {
          const v = watcher.nameTaberogu ? `${watcher.nameTaberogu} ` : "";
          return v || "";
        },
      },
      {
        label: "ぐるなび",
        value: (watcher) => {
          const v = watcher.nameGurunavi ? `${watcher.nameGurunavi} ` : "";
          return v || "";
        },
      },
      {
        label: "ホットペッパー",
        value: (watcher) => {
          const v = watcher.nameHotopepper ? `${watcher.nameHotopepper} ` : "";
          return v || "";
        },
      },
    ],
  },
];
