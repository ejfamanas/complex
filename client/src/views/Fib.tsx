import * as React from "react";
import {default as http} from "axios";
import {useEffect} from "react";

export default function Fib(): JSX.Element {
    const [seenIndexes, setSeenIndexes] = React.useState<Array<number>>([]);
    const [values, setValues] = React.useState<{}>({});
    const [index, setIndex] = React.useState<string>("");
    const fetchValues = async (): Promise<void> => {
        const {data} = await http.get("api/values/current");
        setValues({values: data});
    }
    const fetchIndexes = async (): Promise<void> => {
        const {data} = await http.get("api/values/all");
        setSeenIndexes(data);
    }
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await http.post("api/values", {
            index,
        });
        setIndex("");
    }
    const renderSeenIndexes = (): string => {
        return seenIndexes.map((n: number) => n).join(", ");
    }
    const renderValues = (): Array<JSX.Element> => {
        const entries = [];
        for (let key in values) {
            // @ts-ignore
            const val = values[key];
            entries.push(
                <div key={key}>
                    {`For index ${key} I calculated ${val}`}
                </div>
            );
        }
        return entries;
    }
    useEffect(() => {
        fetchIndexes();
        fetchValues();
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index</label>
                <input
                    value={index}
                    onChange={event => setIndex(event.target.value)}
                />
                <button>Submit</button>
            </form>
            <h3>Indexes I have seen</h3>
            {renderSeenIndexes()}
            <h3>Calculated values</h3>
            {renderValues()}
        </div>
    );
}
