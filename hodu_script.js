/******************** map ***********************/

let mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
let map = new kakao.maps.Map(mapContainer, mapOption);

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
let mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
let zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 마커가 표시될 위치입니다
let markerPosition  = new kakao.maps.LatLng(33.450701, 126.570667);

// 마커를 생성합니다
let marker = new kakao.maps.Marker({
    position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

/******************** image list ***********************/

const imageList = document.querySelector('.image_list');
let pageToFetch = 1;

async function fetchImages(pageNum){
    try {
        const response = await fetch('https://picsum.photos/v2/list?page='+pageNum+'&limit=9');
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }

        const datas = await response.json();
        console.log(datas);

        makeImageList(datas);

    } catch (error) {
        console.error('데이터를 가져오는데 문제가 발생했습니다 :', error);
    }
}

function makeImageList(datas){
    datas.forEach((item)=>{
        imageList.innerHTML = imageList.innerHTML + "<img src="+ item.download_url +" alt=''>";
    });
}

let imageContinue = document.getElementById('continue');
imageContinue.addEventListener('click',(event)=>{
    event.target.parentElement.remove();
    fetchImages(pageToFetch++);

    let timer;

    window.addEventListener('scroll', ()=>{
        // 스크롤이 상단으로부터 얼마나 이동했는지 알아야합니다. (뷰포트의 높이 + 스크롤된 길이)
        // 화면에 로딩된 페이지의 전체 높이
        // 뷰포트의 높이 + 스크롤된 길이 + 10 === 화면에 로딩된 페이지의 전체 높이
        if(!timer) {
            timer = setTimeout(()=>{
                timer = null;
                if(window.innerHeight + document.documentElement.scrollTop + 1100 >= document.documentElement.offsetHeight){
                    fetchImages(pageToFetch++);
                }
            }, 500);
        }
    });
});