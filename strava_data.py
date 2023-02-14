import os
from datetime import datetime
import requests
from dotenv import load_dotenv
import pandas as pd


def main():

    load_dotenv()

    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    refresh_token = os.getenv('REFRESH_TOKEN')
    access_token = os.getenv('ACCESS_TOKEN')

    response = requests.post('https://www.strava.com/oauth/token?' +
                            f'grant_type=refresh_token&refresh_token={refresh_token}' +
                            f'&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}',
                            headers={"Authorization": f"Bearer {access_token}"})

    if (response.ok):
        print('received access token')
        token_data = response.json()
        access_token = token_data['access_token']
        refresh_token = token_data['refresh_token']

        with open('.env', 'w+') as file:
            file.writelines([f'CLIENT_ID={CLIENT_ID}\n',
                             f'CLIENT_SECRET={CLIENT_SECRET}\n',
                             f'REFRESH_TOKEN={refresh_token}\n',
                             f'ACCESS_TOKEN={access_token}\n'])

    else:
        print(f'ERROR: unable to retrieve access token: {response}')
        return

    before = datetime.now().timestamp()
    after = before - 365*24*60*60
    response = requests.get(f'https://www.strava.com/api/v3/athlete/activities?' +
                            f'before={before}&after={after}&page=1&per_page=100',
                            headers={"Authorization": f"Bearer {access_token}"})

    if (response.ok):
        print('fetched activity data')

    else:
        print('ERROR: unable to fetch activity data')
        return

    activities = response.json()
    data = [[x['start_date'],
            x['moving_time'],
            x['distance']] for x in activities]

    df = pd.DataFrame(data, columns=["date", "time", "distance"])
    df['date'] = pd.to_datetime(df['date'])
    df_weekly = df.groupby(pd.Grouper(key='date', freq='W')).sum()
    df_weekly.to_csv('data/strava.csv')

    print('data gathering complete')


if __name__ == "__main__":
    main()
