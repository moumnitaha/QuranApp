import { useEffect, useState } from "react";
import {
  IonButton,
  IonChip,
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import "./ExploreContainer.css";
import axios from "axios";

interface ContainerProps {
  name: string;
}

interface ayah {
  audio: string;
  audioSecondary: string[];
  hizbQuarter: number;
  juz: number;
  manzil: 7;
  number: number;
  numberInSurah: number;
  page: number;
  ruku: number;
  sajda: boolean;
  text: string;
  surah: {
    englishName: string;
    englishNameTranslation: string;
    name: string;
    numberOfAyahs: number;
    revelationType: string;
    number: number;
  };
}

interface qData {
  code: number;
  data: {
    ayahs: ayah[];
    number: number;
  };
  status: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [quran, setQuran] = useState<qData>();
  const [ayahs, setAyahs] = useState<ayah[]>([]);
  const [ayahIndex, setAyahIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(+localStorage.page || 1);
  const [play, setPlay] = useState<boolean>(true);

  const getQuran = async (signal: AbortSignal) => {
    axios
      .get("https://api.alquran.cloud/v1/page/" + page + "/quran-uthmani", {
        signal: signal,
      })
      .then((resp: { data: qData }) => {
        let { data } = resp;
        console.log(data);
        setQuran(data);
        setAyahs(data.data.ayahs);
      })
      .catch((Error) => {
        console.log("Error: ", Error);
      });
  };

  useEffect(() => {
    let controller = new AbortController();
    let signal = controller.signal;
    getQuran(signal);
    return () => controller.abort();
  }, [page]);

  return (
    <>
      {ayahs[0]?.numberInSurah !== 1 && (
        <div className="ion-text-center">
          <IonChip dir="rtl">
            <IonChip>{ayahs[0]?.surah?.number}</IonChip>
            {ayahs[0]?.surah?.name}
          </IonChip>
        </div>
      )}
      <IonContent class="ion-padding ion-text-center lh">
        {ayahs[0]?.numberInSurah === 1 && (
          <IonTitle
            className="surahTitle"
            onClick={() => {
              if (play) {
                setPlay(false);
                let audio = new Audio(
                  "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" +
                    ayahs[0].surah.number +
                    ".mp3"
                );
                audio.play();
                audio.onended = () => setPlay(true);
              }
            }}
          >
            <strong>{ayahs[0]?.surah?.name}</strong>
          </IonTitle>
        )}
        {ayahs?.map((item: ayah, index: number) => {
          return (
            <IonLabel key={index}>
              {index >= 1 &&
                item?.surah?.name !== ayahs[index - 1]?.surah?.name && (
                  <IonTitle
                    className="surahTitle"
                    onClick={() => {
                      if (play) {
                        setPlay(false);
                        let audio = new Audio(
                          "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" +
                            item.surah.number +
                            ".mp3"
                        );
                        audio.play();
                        audio.onended = () => setPlay(true);
                      }
                    }}
                  >
                    <strong>{item?.surah?.name}</strong>
                  </IonTitle>
                )}
              <IonLabel
                onClick={() => {
                  if (play) {
                    setAyahIndex(item.number);
                    setPlay(false);
                    let audio = new Audio(
                      "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" +
                        item.number +
                        ".mp3"
                    );
                    audio.play();
                    audio.onended = () => {
                      setPlay(true);
                      setAyahIndex(0);
                    };
                  }
                }}
                class={ayahIndex === item?.number ? "playing" : ""}
              >
                {item.text}
              </IonLabel>
              <IonChip>
                <strong>{item?.numberInSurah}</strong>
              </IonChip>
            </IonLabel>
          );
        })}
      </IonContent>
      <IonFooter dir="rtl">
        <IonToolbar class="ion-text-center">
          <IonButton
            disabled={page === 1 ? true : false}
            onClick={() => {
              setPage((prev) => (prev > 1 ? prev - 1 : prev));
              localStorage.setItem("page", "" + (page - 1));
            }}
          >
            <IonIcon md={chevronForwardOutline}></IonIcon>
          </IonButton>
          <IonChip>{quran?.data?.number}</IonChip>
          <IonButton
            disabled={page === 604 ? true : false}
            onClick={() => {
              setPage((prev) => (prev < 604 ? prev + 1 : prev));
              localStorage.setItem("page", "" + (page + 1));
            }}
          >
            <IonIcon md={chevronBackOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

export default ExploreContainer;
