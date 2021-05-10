import Chart from 'react-apexcharts'
import { useEffect, useState } from 'react'
import { BASE_URL } from 'utils/requests'
import axios from 'axios'
import { SaleSuccess } from 'types/sale'
import { round } from 'utils/format'

type SeriesData = {
    name: string
    data: number[]
}

type ChartData = {
    labels: { categories: string[] }
    series: SeriesData[]
}

const BarChart = () => {
    const [chartData, setChartData] = useState<ChartData>({
        labels: {
            categories: []
        },
        series: [
            {
                name: "",
                data: []
            }
        ]
    })

    useEffect(() => {
        axios.get(`${BASE_URL}/sales/success-by-seller`)
            .then(response => {
                const data = response.data as SaleSuccess[]
                const myLabels = data.map(o => o.sellerName)
                const mySeries = data.map(o => round(100.0 * o.deals / o.visited, 1))

                setChartData({
                    labels: {
                        categories: myLabels
                    },
                    series: [
                        {
                            name: "% Success",
                            data: mySeries
                        }
                    ]
                })
            })
    }, [])
    
    const options = {
        plotOptions: {
            bar: { horizontal: true }
        },
    };

    return (
        <Chart
            options={{ ...options, xaxis: chartData.labels }}
            series={chartData.series}
            type="bar"
            height="240"
        />
    )
}

export default BarChart
