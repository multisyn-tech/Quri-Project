

const SpinnerComponent = () => {

    //   const [settingsData, setSettingsData] = useState(null);
    //   const [settingsLoaded, setSettingsLoaded] = useState(false);

  // const fetchSettings = async () => {
    
  //   try {
  //     console.log('response=called=1')
  //     const response = await ManageServices.getSettingsByKey('website_logo');
  //     console.log('response', response)
  //     const data = response?.data?.data
  //     console.log('data,data', data)
  //     if (data.keyName === 'website_logo') {
  //       setSettingsData(data.value)
  //     }

  //     setSettingsLoaded(true);
  //   } catch (err) {
  //     console.log('response=called=2')
  //     console.log('Error fetching settings:', err);
  //     setSettingsLoaded(true);
  //   }
  // };

  // useEffect(() => {
    
  //   fetchSettings();
  // }, []);


  return (
    <div className="fallback-spinner app-loader">
      {/* <img className="fallback-logo" src={getImageUrl(settingsData)} alt="logo" /> */}
      <div className="loading">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  )
}

export default SpinnerComponent
