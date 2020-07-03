# Chart-Plot chalange

## 1 General

The project has made with React using Typescript to make manteance more easy. For the State management the Redux was chosen.

```typescript
State:IEventState = {
  console: '',
  queue: [],
  dataValues: {},
  limit: 500,
  dataStepSize:50,
  dataRangeSize: 100,
  updateTimeRate: 10000,
  showLastFirst: true,
  presetColors:{},

}
```

All custom Types are in the `types.ts` file.

For make the components more cleaner, the most functions are in `consts.ts` file

## 2 Components

This project is made with four main components: `<Console/>` `<ChartPlot/>` `<Footer/>` `<UserInterface>`

### 2.1 Console

Where the text of the events is inserted.

Initially, the monaco-editor library was chosen, but the type of use does not justify the complexity of the component. So `<textarea>` was chosen. It saves the text in `State.console`

### 2.2 Footer

Where the `State.console` is converted to `IEvent[]` using `StringToObj()`, ordered by *timestemp* and then converted to `IDataValue` using `EventsToDatavalues()` ,to be save it on `State.dataValues`, or if the number of events was bigger than `State.limit` the surplus `IEvent[]` is placed on `State.queue`

### 2.3 ChartPlot

`react-chartjs-2` was chosen to make the chartPlot because it is simple and has a good design. The component converts the `State.Datavalues` to `ChartData` using `DataValuesToChartData()`

#### 2.3.1 Labels

The labels are made with the `select` and `group` properties of the **span event** using `createLabels()`

#### 2.3.2 Cores

All labels are given random colors that are not duplicated when datasets are created, but an object `IPreSetColors` can be optional provided with custom colors

### 2.4 UserInterface

To make resizeble components was used `react-resize-panel`, but t are not typescript componente sou the **UserInterface** was created to encapsulate the `.jsx` components

## 3 Processamento de dados

The control of amount data  is made by the variables below

1. `State.limit: number`
2. `State.dataRangeSize:number`
3. `State.updateTimeRate:number`
4. `State.dataStepSize:number`
5. `State.showLastFirst:boolean`

**State.limit**: Show the maximum number of events to be plotted

**State.dataRangeSize**: Show the number of events currently plotted. Increases with each update up to the `limit`
**State.updateTimeRate:** The time(miliseconds) between each *State.dataRangeSize* update.

**State.dataStepSize:** Number of events will be inserted with each update
**State.showLastFirst:** Define if de lasts events will be plotted first

When the number of events exceeds the limit, all excess is saved in `State.queue` and with each update some `IEvent` are removed from `queue` converted in `IDataValue` using `EventsToDataValue()` and added in `State.dataValues`.