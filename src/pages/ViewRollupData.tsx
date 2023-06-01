import { useState, useEffect } from "react";
import styles from "../styles/ViewRollupData.module.css";
import { RollupConfigData } from './rollup';
import { L3Config } from './l3Config';
import Image from "next/image";

const removeFields = (obj: any, fieldsToRemove: string[]): any => {
  let newObj = JSON.parse(JSON.stringify(obj));

  fieldsToRemove.forEach(field => {
    if (newObj.hasOwnProperty(field)) {
      delete newObj[field];
    }
  });

  return newObj;
}

const ViewRollupData = () => {
  const [data, setData] = useState<RollupConfigData | null>(null);
  const [l3Config, setL3Config] = useState<L3Config | null>(null);
  const [showData, setShowData] = useState(false);
  const [showL3Config, setShowL3Config] = useState(false);

  const unwantedFields = ["inboxAddress", "adminProxy", "sequencerInbox", "bridge", "utils", "validatorWalletCreator", "blockNumber","rollupAddress"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rollupData = localStorage.getItem("rollupData");

      if (rollupData) {
        let parsedData = JSON.parse(rollupData);
        let cleanedData = removeFields(parsedData, unwantedFields);
        setData(cleanedData);
      }

      const l3ConfigData = localStorage.getItem("l3Config");

      if (l3ConfigData) {
        setL3Config(JSON.parse(l3ConfigData));
      }
    }
  }, []);

  const downloadJSON = (dataToDownload: RollupConfigData | L3Config | null, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(dataToDownload, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }

  const toggleShowData = () => {
    setShowData(!showData);
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <Image
          className={styles.logo} 
          src="/logo.svg"
          alt="Logo"
          width={250}
          height={250}
        />
        <h1 className={styles.title}>No rollup data found.</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Image
        className={styles.logo} 
        src="/logo.svg"
        alt="Logo"
        width={250}
        height={250}
      />
      <h1 className={styles.title}>Rollup Data:</h1>
      <button className={styles.button} onClick={() => downloadJSON(data, 'rollupData.json')}>Download Rollup JSON</button>
      <button className={styles.button} onClick={() => downloadJSON(l3Config, 'l3Config.json')}>Download L3Config JSON</button>
      <button className={styles.button} onClick={toggleShowData}>Show/Hide Rollup Data</button>
      <button className={styles.button} onClick={() => setShowL3Config(!showL3Config)}>Show/Hide L3Config Data</button>
      {showData && 
        <pre className={styles.data}>
          {JSON.stringify(data, null, 2)}
        </pre>
      }
      {showL3Config && 
        <pre className={styles.data}>
          {JSON.stringify(l3Config, null, 2)}
        </pre>
      }
    </div>
  );
};

export default ViewRollupData;
