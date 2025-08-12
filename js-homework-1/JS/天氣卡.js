
const regionAll = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣',
        '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'
    ],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'],
    ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'],
    ['宜蘭縣', '花蓮縣', '臺東縣'],
    ['澎湖縣', '金門縣', '連江縣'],
]
// -------------------------
const url =
    'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-7C520AD0-D77D-49C3-827A-8FBA26E1E014&format=JSON&locationName=&elementName='
// console.log(url);


const btnAll = document.querySelectorAll('.btn');
const cardRegion = document.querySelector('.card-region');

let orginalData; // 存放氣象局拿到的資料
let orgData = {}; // 整理後的資料
let region = regionAll[0]; // 預設全部
let content = '';

// 取得資料
fetchData();
// 利用foreach每一btn加入addEventListener
// 當按下後決定要顯示的區域
// rerion = regionAll[index] 
// -------------------------------
function fetchData() {
    // 從url取得資料
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(3, data);
            orginalData = data;
            // 處理資料
            organizationData();
            arrangeCities();
        })
        .catch(error => console.error("API請求失敗:", error));
}

btnAll.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        region = regionAll[index];
        arrangeCities();
    });
});

// 處理資料
function organizationData() {
    const locationAll = orginalData.records.location;
    // console.log(locationAll);
    locationAll.forEach(location => {
        // console.log(location);
        const locationName = location.locationName;
        //                                        現在時段
        const wEl0T0 = location.weatherElement[0].time[0];
        // console.log(9, wEl0T0);
        let startTime = wEl0T0.startTime;
        console.log(startTime);
        // 天氣狀況
        const wxCondition = wEl0T0.parameter.parameterName;
        // 天氣晴陰雨那些圖
        let wxImgCode = wEl0T0.parameter.parameterValue;
        if (Number(wxImgCode) < 10) {
            wxImgCode = `0${wxImgCode}`;
        }
        // console.log(wxCondition, wxImgCode);
        //最高溫
        const maxT = location.weatherElement[4].time[0].parameter.parameterName;
        //最低溫
        const minT = location.weatherElement[2].time[0].parameter.parameterName;
        //濕度
        const pop = location.weatherElement[1].time[0].parameter.parameterName;
        // console.log(maxT);
        // ....其它自己做

        // 做完一個縣資料 就要放入 組織後的資料物件 orgData
        // 新增一個 key 為 台中市 的 物件 到 orgData
        // 這個技巧一定要好好了瞭解
        // orgData['台中市'] = {};
        //  新增一個 key 為 locationName的字串 的 物件 到 orgData
        orgData[locationName] = {
            'Wx': wxCondition,
            'WxCode': wxImgCode,
            'startTime': startTime,
            'maxT': maxT,
            'minT': minT,
            'pop': pop,
        };
        console.log(orgData);
    });
}

// 處理各(區域)縣市
function arrangeCities() {
    content = ''; // 顯示每個區域前都要清空
    region.forEach(city => {
        const cityData = orgData[city];
        // console.log(100, cityData);
        showCard(city, cityData);
        // showCard(city, orgData[city]);
    });
    // 最後顯示在網頁上
    cardRegion.innerHTML = content;
}

function showCard(city, cityData) {
    content += `
        <div class="card">
            <div class="city-info">
               <span class="city-name">${city}</span><br><br>
                <span class="weather-condition">${cityData.Wx}</span><br><br><br>
                <span class="icon">
                    <img src="https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${cityData.WxCode}.svg" 
                        alt="${cityData.Wx}" title="${cityData.Wx}">
                </span>
            </div>
            <div class="info">
                最高溫: ${cityData.maxT}°C<br><br>
                最低溫: ${cityData.minT}°C<br><br>
                濕度: ${cityData.pop}%<br><br>
                時間: ${cityData.startTime.replaceAll('-', '/')}<br>
            </div>
        </div>
    `;
}
