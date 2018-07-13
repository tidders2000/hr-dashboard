 queue()
            .defer(d3.csv, "data/data_dash_2.csv")
            .await(makeGraphs);

        queue()
            .defer(d3.json, "data/transactions.json")
            .await(makeGraphs2);

        queue()
            .defer(d3.json, "data/transactions.json")
            .await(makeGraphs3);


        function makeGraphs(error, transactionsData) {

            var ndx = crossfilter(transactionsData);


            var name_dim = ndx.dimension(dc.pluck('location'));

            var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('head count'));
            dc.pieChart('#hc-loc')
                .height(430)
                .radius(170)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(total_spend_per_person);
                
        var name_dim = ndx.dimension(dc.pluck('location'));

            var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('days abs'));
            dc.pieChart('#sick-loc')
                .height(430)
                .radius(170)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(total_spend_per_person);
                
         
              
            var name_dim = ndx.dimension(dc.pluck('Dept'));

            var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('days abs'));
            dc.pieChart('#sick-dept')
                .height(430)
                .radius(170)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(total_spend_per_person);  
    








            var vac_dim = ndx.dimension(dc.pluck('Dept'));

            var total_vac_per_dept = vac_dim.group().reduceSum(dc.pluck('vac'));

            dc.barChart("#vac-dept")
                .width(780)
                .height(430)
                .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(vac_dim)
                .group(total_vac_per_dept)
                .transitionDuration(500)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Department")
                .yAxisLabel("Vacancies")
                .yAxis().ticks(8);



            var cost_dim = ndx.dimension(dc.pluck('Dept'));

            var total_cost_per_dept = cost_dim.group().reduceSum(dc.pluck('cost'));

            dc.barChart("#rc-loc")
                .width(580)
                .height(430)
                .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(cost_dim)
                .group(total_cost_per_dept)
                .transitionDuration(500)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Department")
                .yAxisLabel("Cost (£)")
                .yAxis().ticks(8);


            var name_dim = ndx.dimension(dc.pluck('Dept'));

            var FTE = name_dim.group().reduceSum(dc.pluck("FTE"))

            var WTE = name_dim.group().reduceSum(dc.pluck("head count"))
            var stackedChart = dc.barChart("#hc-dept");
            stackedChart
                .width(580)
                .height(430)
                .dimension(name_dim)
                .group(FTE, "FTE")
                .stack(WTE, "HC")
                  .xAxisLabel("Department")
                .yAxisLabel("Count")
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));
            stackedChart.margins(), right = 100;




            dc.renderAll();
        }






        function makeGraphs2(error, transactionData) {

            var ndx = crossfilter(transactionData);



            var parseDate = d3.time.format("%d/%m/%Y").parse;
            transactionData.forEach(function(d) {
                d.date = parseDate(d.date);
            });
            var date_dim = ndx.dimension(dc.pluck('date'));
            var minDate = date_dim.bottom(1)[0].date;
            var maxDate = date_dim.top(1)[0].date;
            var tomSpendByMonth = date_dim.group().reduceSum(function(d) {
                if (d.name === 'Location A') {
                    return +d.spend;
                }
                else {
                    return 0;
                }
            });
            var bobSpendByMonth = date_dim.group().reduceSum(function(d) {
                if (d.name === 'Location B') {
                    return +d.spend;
                }
                else {
                    return 0;
                }
            });
            var aliceSpendByMonth = date_dim.group().reduceSum(function(d) {
                if (d.name === 'Location C') {
                    return +d.spend;
                }
                else {
                    return 0;
                }
            });
            var compositeChart = dc.compositeChart('#chart-here');
            compositeChart
                .width(1100)
                .height(400)
                .dimension(date_dim)
                .x(d3.time.scale().domain([minDate, maxDate]))
                .yAxisLabel("Amount Spent")
                .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
                .renderHorizontalGridLines(true)
                .compose([
                    dc.lineChart(compositeChart)
                    .colors('green')
                    .group(tomSpendByMonth, 'Location A'),
                    dc.lineChart(compositeChart)
                    .colors('red')
                    .group(bobSpendByMonth, 'Location B'),
                    dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(aliceSpendByMonth, 'Location C')
                ])
                .brushOn(false)
                .render();

            dc.renderALl();
        }

        function makeGraphs3(error, transactionData) {

            var ndx = crossfilter(transactionData);

            var parseDate = d3.time.format("%d/%m/%Y").parse;
            transactionData.forEach(function(d) {
                d.date = parseDate(d.date);
            });
            var date_dim = ndx.dimension(function(d) {
                return d.date;
            });
            var min_date = date_dim.bottom(1)[0].date;
            var max_date = date_dim.top(1)[0].date;

            var spend_dim = ndx.dimension(function(d) {
                return [d.date, d.spend];
            });
            var spend_group = spend_dim.group();
            var spend_chart = dc.scatterPlot("#scatter-plot");
            spend_chart
                .width(1100)
                .height(400)
                .x(d3.time.scale().domain([min_date, max_date]))
                .brushOn(false)
                .symbolSize(8)
                .clipPadding(10)
                .yAxisLabel("Amount Spent")
                .xAxisLabel("Expenses")
                .dimension(spend_dim)
                .group(spend_group);


            dc.renderAll();
        }