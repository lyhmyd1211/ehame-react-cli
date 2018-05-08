export  function locationHashDefault(permissions) {
  let powers = permissions;
  let menuPowers ={};
  let menus = ['home','bogieMonitor','carHealth','carStatusContrast','pendingFault','distributedFault','historyFault','abnormalWarning','energyComparison','faultStatistics','trainFault','faultLevel','failureState','energyVehicle','energyContrast','energyConsumption','vehicleHealth','healthTrends','operationLog','faultType','systemDistribution','systemContrast','trainEnergyComparison','predictTramFaultSum','predictTramHealthScore','commonProblem','faq','componentManagement','unitManagement','moduleManagement','diagramManagement','weightManagement','user','role','menu','organization','dictionary','monitoring'];
  powers&&powers.map((item,index) => {
    switch(item){
    case '20001.30100.000':
      menuPowers.home = '#/conditionMonitor/home';
      break;
    case '20001.30200.003':
      menuPowers.bogieMonitor = '#/conditionMonitor/bogieMonitor';
      break;

    case '20001.30300.003':
      menuPowers.carHealth = '#/carHealthAssess/carHealth';
      break;
    case '20001.30400.003':
      menuPowers.carStatusContrast = '#/carHealthAssess/carStatusContrast';
      break;

    case '20002.31100.003':
      menuPowers.pendingFault = '#/currentFault/pendingFault';
      break;
    case '20002.31200.003':
      menuPowers.distributedFault = '#/currentFault/distributedFault';
      break;
    case '20002.31300.003':
      menuPowers.historyFault = '#/currentFault/historyFault';
      break;

    case '20001.30500.003':
      menuPowers.abnormalWarning = '#/energyManagement/abnormalWarning';
      break;
    case '20001.30600.003':
      menuPowers.energyComparison = '#/energyManagement/energyComparison';
      break;

    case  '20003.32201.003':
      menuPowers.faultStatistics = '#/statisticalAnalysis/faultStatistics';
      break;
    case  '20003.32204.003':
      menuPowers.trainFault = '#/statisticalAnalysis/trainFault';
      break;
    case  '20003.32205.003':
      menuPowers.faultLevel = '#/statisticalAnalysis/faultLevel';
      break;
    case  '20003.32206.003':
      menuPowers.failureState = '#/statisticalAnalysis/failureState';
      break;
    case  '20003.32208.003':
      menuPowers.energyVehicle = '#/statisticalAnalysis/energyVehicle';
      break;
    case  '20003.32209.003':       
      menuPowers.energyContrast = '#/statisticalAnalysis/energyContrast';
      break;
    case  '20003.32210.003':
      menuPowers.energyConsumption = '#/statisticalAnalysis/energyConsumption';
      break;
    case  '20003.32211.003':
      menuPowers.vehicleHealth = '#/statisticalAnalysis/vehicleHealth';
      break;
    case  '20003.32212.003':
      menuPowers.healthTrends = '#/statisticalAnalysis/healthTrends';
      break;
    case  '20003.32213.003':
      menuPowers.operationLog = '#/statisticalAnalysis/operationLog';
      break;
    case  '20003.32207.003':
      menuPowers.faultType = '#/statisticalAnalysis/faultType';
      break;
    case  '20003.32202.003':
      menuPowers.systemDistribution = '#/statisticalAnalysis/systemDistribution';
      break;
    case  '20003.32203.003':
      menuPowers.systemContrast = '#/statisticalAnalysis/systemContrast';
      break;
    case  '20003.32214.003':       
      menuPowers.trainEnergyComparison = '#/statisticalAnalysis/trainEnergyComparison';
      break;
    case  '20003.32215.003':
      menuPowers.predictTramFaultSum = '#/statisticalAnalysis/predictTramFaultSum';
      break;
    case  '20003.32215.003':
      menuPowers.predictTramHealthScore = '#/statisticalAnalysis/predictTramHealthScore';
      break;

    case  '20002.31400.003':
      menuPowers.commonProblem = '#/expertKnowledgeBase/commonProblem';
      break;
    case  '20002.31500.003':
      menuPowers.faq = '#/expertKnowledgeBase/faq';
      break;
    case  '20001.30100.000':
      menuPowers.componentManagement = '#/basicData/componentManagement';
      break;
    case  '20002.31600.003':
      menuPowers.unitManagement = '#/basicData/unitManagement';
      break;
    case  '20002.31800.003':
      menuPowers.moduleManagement = '#/basicData/moduleManagement';
      break;
    case  '20002.31800.003':       
      menuPowers.diagramManagement = '#/basicData/diagramManagement';
      break;
    case  '20001.30701.000':
      menuPowers.weightManagement = '#/basicData/weightManagement';
      break;

    case  '20001.30800.000':
      menuPowers.user = '#/system/user';
      break;
    case  '20001.30801.000':       
      menuPowers.role = '#/system/role';
      break;
    case  '10008.10106.000':
      menuPowers.organization = '#/system/organization';
      break;
    case  '10003.10301.000':
      menuPowers.dictionary = '#/system/dictionary';
      break;
    case  '20001.30803.000':
      menuPowers.monitoring = '#/system/monitoring';
      break;
    }
  });
  for (let i = 0; i <menus.length; i++) {
    if (menuPowers[menus[i]]!=undefined) {
      location.hash = menuPowers[menus[i]];
      break;
    }
  }
}